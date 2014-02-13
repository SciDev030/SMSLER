Osp.Core.Mixin.define("SMSLER.API",
{	
	members:
	{
		sendMsg: function(recipent, text, mode)
		{
			this.setLoading(true);

			var rField = this.recipentField;
			var mField = this.msgField;

			var messageSendCallback =
			{
				onsuccess: function()
				{
					this.setLoading(false);
					rField.setText("");
					mField.setText("");
					alert(Osp.App.AppResource.getString("IDS_POPUP_SENDSUCCESS"));
				},
				onmessagesendsuccess: function(recipient)
				{
					console.log("The SMS has been sent to " + recipient);
				}, 
				onmessagesenderror: function(error, recipient)
				{
					this.setLoading(false);
					alert(Osp.App.AppResource.getString("IDS_ERROR_SENDFAILED"));
				}
			};

			function messageSendErrorCallback(error)
			{
				switch(error.message)
				{
					case "INVALID_VALUES_ERR":
						alert(Osp.App.AppResource.getString("IDS_ERROR_INVALIDVALUE"));
						break;
					case "NOT_SUPPORTED_ERR":
						alert(Osp.App.AppResource.getString("IDS_ERROR_NOTSUPPORTED"));
						break;
					case "SECURITY_ERR":
						alert(Osp.App.AppResource.getString("IDS_ERROR_SECURITY"));
						break;
					default:
						alert(Osp.App.AppResource.getString("IDS_ERROR_UNKNOWN"));
						break;
				}
				this.setLoading(false);
			}

			try
			{	
				var numbers = recipent.split(","); // converting to DOMString[]
				var type = deviceapis.messaging.createMessage(deviceapis.messaging.TYPE_SMS);

				msg = type;
				msg.to = numbers;
				msg.body = text;

				deviceapis.messaging.sendMessage(messageSendCallback, messageSendErrorCallback, msg);
			}
			catch(e)
			{
				alert(e.message);
				this.setLoading(false);
			}
		},

		saveDraft: function()
		{
			var newTitle = this.Encode(this.draftTitle.getText());
			var newMessage = this.Encode(this.msgField.getText());

			if(newTitle == "")
				alert(Osp.App.AppResource.getString("IDS_ERROR_EMPTYFIELDS_TITLE"));
			else if(newMessage == "")
				alert(Osp.App.AppResource.getString("IDS_ERROR_EMPTYFIELDS_MESSAGE"));
			else
			{
				this.setLoading(true);

				if(localStorage.getItem("drafting") == null)
				{
					var userDrafts = [];
					userDrafts[0] = {"title":this.newTitle,"text":newMessage,"removable":"yes"};
					var saveItem = {};
					saveItem.results = userDrafts;

					var loadArray = this.drafts.results;
					var arrayLength = loadArray.length;
					this.drafts.results = Osp.Core.ArrayHelper.insertAt(loadArray, userDrafts[0], arrayLength);
				}
				else
				{
					var draftArray = JSON.parse(localStorage.getItem("drafting")).results;
					var newDraft = {"title":newTitle,"text":newMessage,"removable":"yes"};
					var userDrafts = Osp.Core.ArrayHelper.insertAt(draftArray, newDraft, draftArray.length);

					var saveItem = {};
					saveItem.results = userDrafts;

					var loadArray = this.drafts.results;
					var arrayLength = loadArray.length;
					this.drafts.results = Osp.Core.ArrayHelper.insertAt(loadArray, newDraft, arrayLength);
				}

				localStorage.setItem("drafting", JSON.stringify(saveItem));

				function getItemTemplate() // Defines the style template of the item.
				{
					var item =
					{
						height : 60,
						setting :
						{
							backgroundColor :
							{
								normal : '#000000',
								pressed : '#000000'
							},
							annex : Osp.Ui.Controls.ListAnnexStyle.RADIO,
							elements : []
						}
					};
					return item;
				}

				function getItemTextElement() // Defines the style template of the item.
				{
					var itemElement =
					{
						bounds: {x: 70, y: 0, width: 410, height: 60},
						text: 'Item',
						selectable: false,
						textSize: 30,
						textColor: {
							normal: '#ffffff',
							pressed: '#ffffff'
						},
						textSliding: false
					};
					return itemElement;
				}

				function getItemImage() // Defines the style template of the item image.
				{
					var image =
					{
						image:
						{
							normal:
							{
								src: './images/lock.png',
								bounds: {x: 10, y: 5, width: 50, height: 50}
							},
							pressed:
							{
								src: './images/lock.png',
								bounds: {x: 10, y: 5, width: 50, height: 50}
							}
						}
					};
					return image;
				}

				var listItem = getItemTemplate(); 
				var itemText = getItemTextElement();
				var itemImage = getItemImage();

				itemImage.image.normal.src = './images/unlock.png';
				itemImage.image.normal.bounds = {x: 10, y: 5, width: 50, height: 50};
				itemImage.image.pressed.src = './images/unlock.png';
				itemImage.image.pressed.bounds = {x: 10, y: 5, width: 50, height: 50};
				listItem.setting.elements.push(itemImage);

				itemText.text = this.draftTitle.getText();
				listItem.setting.elements.push(itemText);

				if(localStorage.getItem("settings_listsort") == "newFirst")
					this.draftList.insertItemAt(3, listItem);
				else
					this.draftList.addItem(listItem);

				Osp.Core.Function.delay(function()
				{
					// header
					var totalItems = this.draftList.getItemCount();
					this.headerObj.setTitleText(Osp.App.AppResource.getString("IDS_BUTTONS_DRAFTS")+" ("+totalItems+")");
					this.headerObj.setTitleTextColor("#FFFFFF");
					this.addDeleteButton();
					// footer
					this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);	
					this.footerObj.setItemSelected(1);
					// Sender
					this.recipentHeadline.setVisible(false);
					this.recipentField.setVisible(false);
					this.msgHeadline.setVisible(false);
					this.msgField.setVisible(false);
					this.msgField.setText("");
					this.sendButton.setVisible(false);
					this.cancelButton.setVisible(false);
					// Settings
					this.settingsScrollPage.setVisible(false);
					// Draft
					this.draftList.setVisible(true);
					this.draftTitle.setVisible(false);
					this.draftTitle.setText("");
					this.saveButton.setVisible(false);

					for(var i = 0; i < this.draftList.getItemCount(); i++)
					{
						if(this.draftList.isItemEnabled(i))
							this.draftList.setItemChecked(i, false);
						if(this.draftList.isItemChecked(i))
							this.draftList.setItemChecked(i, false);
					}

					this.setLoading(false);
				}, 750, this);
			}
		},

		loadDrafts: function()
		{	
			var draftArray = [];
			draftArray[0] = {"title":Osp.App.AppResource.getString("IDS_DEFAULT_HEAD1"),"text":Osp.App.AppResource.getString("IDS_DEFAULT_MESSAGE1"),"removable":"no"};
			draftArray[1] = {"title":Osp.App.AppResource.getString("IDS_DEFAULT_HEAD2"),"text":Osp.App.AppResource.getString("IDS_DEFAULT_MESSAGE2"),"removable":"no"};
			draftArray[2] = {"title":Osp.App.AppResource.getString("IDS_DEFAULT_HEAD3"),"text":Osp.App.AppResource.getString("IDS_DEFAULT_MESSAGE3"),"removable":"no"};
			
			if(localStorage.getItem("drafting") != null)
			{
				var rspObject;
				if(localStorage.getItem("settings_listsort") == "newFirst")
					rspObject = JSON.parse(localStorage.getItem("drafting")).results.reverse();
				else
					rspObject = JSON.parse(localStorage.getItem("drafting")).results;

				for(var i = 0, j = 3; i < rspObject.length; i++, j++)
					draftArray[j] = rspObject[i];
			}
			this.drafts.results = draftArray;
		},

		searchContact: function()
		{
			var hdObj = this.headerObj;
			var ftObj = this.footerObj;
			var recField = this.recipentField;
			var string = this.recipentField.getText();
			var mainForm = this.mainForm;
			var msgHeadline = this.msgHeadline;
			var msgField = this.msgField;
			var mainFormY = this.mainForm.getClientAreaBounds().y;
			
			if(localStorage.getItem("settings_contactsearch") == "allowed")
			{
				this.setLoading(true);

				var addressbook;

				if(Osp.Core.StringHelper.startsWith(string, '+') || Osp.Core.StringHelper.startsWith(string, '0') || Osp.Core.StringHelper.startsWith(string, '1') || Osp.Core.StringHelper.startsWith(string, '2') || Osp.Core.StringHelper.startsWith(string, '3') || Osp.Core.StringHelper.startsWith(string, '4') || Osp.Core.StringHelper.startsWith(string, '5') || Osp.Core.StringHelper.startsWith(string, '6') || Osp.Core.StringHelper.startsWith(string, '7') || Osp.Core.StringHelper.startsWith(string, '8') || Osp.Core.StringHelper.startsWith(string, '9'))
				{
					recField.setText(string);
					this.setLoading(false);
				}
				else
				{
					mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, false);
					function errorCallback(response)
					{
						alert(Osp.App.AppResource.getString("IDS_ERROR_ERRORCODE")+": " + response.code);
						mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);
					}

					function loadContacts(contacts)
					{
						if (contacts.length == 1)
						{
							recField.setText(contacts[0].phoneNumbers[0].number);
							mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);
						}
						else if (contacts.length > 1)
						{
							hdObj.removeAllButtons();
							hdObj.setButton("right", {actionId: 24, icon: {normal: './images/delete.png', pressed: './images/delete_pressed.png'}});
							hdObj.setButtonColor({normal : '#0AB0DA', pressed : '#18C7E7'});

							hdObj.addListener("actionPerform", function(e)
							{
								recField.setText("");
								this.possibleRecipients.setVisible(false);
								mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);
								hdObj.setTitleText("SMS|ER");
								hdObj.removeAllButtons();
								hdObj.setButton("left", {actionId: 23, icon: {normal: './images/contact.png', pressed: './images/contact_pressed.png'}});
								hdObj.setButtonColor({normal : '#0AB0DA', pressed : '#18C7E7'});
							}, this);

							if(mainFormY == 72)
								this.possibleRecipients = new Osp.Ui.Controls.List({bounds: {x: 0, y: 0, width: 480, height: 690}, itemDivider: true, fastScroll: false});
							else
								this.possibleRecipients = new Osp.Ui.Controls.List({bounds: {x: 0, y: 0, width: 480, height: 621}, itemDivider: true, fastScroll: false});

							for (var i = 0; i < contacts.length; i++)
							{
								if(JSON.stringify(contacts[i].phoneNumbers) == "[]")
									continue;

								var tempItem = getRecipientsItem(contacts[i].firstName, contacts[i].lastName, JSON.stringify(contacts[i].phoneNumbers));
								this.possibleRecipients.addItem(tempItem);

								for(i = 0; i < this.possibleRecipients.getItemCount(); i++)
									this.possibleRecipients.showItemDescriptionText(i); 
							}

							hdObj.setTitleText(Osp.App.AppResource.getString("IDS_FOUND")+" ("+this.possibleRecipients.getItemCount()+")");
							this.possibleRecipients.addListener("listItemStateChange", selectRecipient, this);

							mainForm.addControl(this.possibleRecipients);
							this.possibleRecipients.setVisible(true);

							function selectRecipient(e)
							{
								var item = this.possibleRecipients.getItemAt(e.getData().index).setting;
								recField.setText(item.descriptionText);
								this.possibleRecipients.setVisible(false);
								mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);
								hdObj.setTitleText("SMS|ER");
								hdObj.removeAllButtons();
								hdObj.setButton("left", {actionId: 23, icon: {normal: './images/contact.png', pressed: './images/contact_pressed.png'}});
								hdObj.setButtonColor({normal : '#0AB0DA', pressed : '#18C7E7'});
							}

							function getRecipientsItem(firstName, lastName, numbers)
							{
								var numberArray = numbers.split(",");
								r = new RegExp(['"']);
								var getNumber = Osp.Core.StringHelper.replace(Osp.Core.StringHelper.replace(Osp.Core.StringHelper.substr(numberArray[0].toString(), Osp.Core.StringHelper.indexOf(numberArray[0].toString(),":",0)+1, 20), r, ""), r, "");
								var item =
								{
									height: 60,
									setting:
									{
										backgroundColor:
										{
											normal: '#000000',
											pressed: '#000000'
										},
										annex: Osp.Ui.Controls.ListAnnexStyle.NORMAL,
										descriptionText: getNumber,
										descriptionTextColor: '#0AB0DA',
										elements: []
									}   
								};

								item.setting.elements.push({
									bounds: {x: 5, y: 0, width: 5, height: 60}
								});

								item.setting.elements.push({
									text: firstName+" "+lastName,
									textSize: 30,
									textColor: {
										normal: '#ffffff',
										pressed: '#ffffff'
									}
								});

								return item;
							}
						}
						else
						{
							recField.setText("");
							alert(Osp.App.AppResource.getString("IDS_ERROR_NOCONTACT"));
							mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);
						}
						hdObj.setProgressIcon(null);
					}

					function addressBooksCB(addressbooks)
					{
						if (addressbooks.length > 0)
						{
							try
							{
								addressbook = addressbooks[0];
								addressbook.findContacts(loadContacts, errorCallback, {firstName: "%"+string+"%", lastName: "%"+string+"%"});
							}
							catch (e)
							{
								try
								{
									addressbook = addressbooks[1];
									addressbook.findContacts(loadContacts, errorCallback, {firstName: "%"+string+"%", lastName: "%"+string+"%"});
								}
								catch (e)
								{
									alert(e);
								}
							}
						}
					}
					deviceapis.pim.contact.getAddressBooks(addressBooksCB, errorCallback);
				}
			}
		},

		pickContacts: function()
		{
			var rField = this.recipentField;

			var appControlCallback = function(callback, appControlId, operationId, resultList)
			{
				var appControlStatus = resultList[0];
				if(appControlStatus === "Succeeded")
				{
					var contactArray = new Array();
					for(var j = 0, i = 2; i < resultList.length; i++, j++)
						contactArray[j] = resultList[i];
					rField.setText(contactArray.toString());
				}
			};

			var appControlObject = Osp.App.AppManager.findAppControl("osp.appcontrol.provider.contact", "osp.appcontrol.operation.pick");

			if (appControlObject)
			{
				var dataList = [];
				dataList[0] = "selectionMode:multiple";
				dataList[1] = "returnType:phone"; 
				appControlObject.start(dataList, appControlCallback);
			}
		},

		completeUpdate: function()
		{
			var myDrafts = JSON.parse(localStorage.getItem("drafting")).results;

			for(i = 0; i < myDrafts.length; i++)
			{
				var selectItem = myDrafts[i];
				if(selectItem.removable == "no")
					myDrafts.splice(i, 1);
			}

			var saveItem = {};
			saveItem.results = myDrafts;

			localStorage.setItem("drafting", JSON.stringify(saveItem));
			localStorage.setItem("updateInstall", "done");
		},

		importDrafts: function()
		{
			this.setLoading(true);

			var drafts = this.drafts;
			var hdObj = this.headerObj;
			var draftList = this.draftList;
			var self = this;
			var today = new Date();
			var param = {date: {day : today.getDay(), month : today.getMonth(), year : today.getFullYear()}, time : {hours : today.getHours(), minutes : today.getMinutes(), seconds : today.getSeconds()}, style : Osp.Locales.DateTimeStyle.DATE_TIME_STYLE_SHORT};
			var formattedTime = Osp.Locales.Formatter.formatDateTime(param);
			var importDate = today.toLocaleDateString()+" "+today.toLocaleTimeString();
			var storage = localStorage.getItem("settings_storage");
			var importDir;
			var importFile;

			if(storage == "phone")
				importDir = 'documents/smsler';
			else
				importDir = 'removable/Others/smsler';

			deviceapis.filesystem.resolve(function(dir)
			{
				importFile = dir.resolve('export.drft');
				importFile.readAsText(function(content)
				{
					var importArray = JSON.parse(content).results;
					var saveItem = {};
					var loadArray = drafts.results;

					if(localStorage.getItem("drafting") == null || JSON.parse(localStorage.getItem("drafting")).results == "")
					{
						saveItem.results = importArray;
						drafts.results = Osp.Core.ArrayHelper.append(loadArray, importArray);
					}
					else
					{
						var draftArray = JSON.parse(localStorage.getItem("drafting")).results;

						for(var i = 0; i < draftArray.length; i++)
						{
							for(var j = 0; j < importArray.length; j++)
							{
								if(importArray[j].title == draftArray[i].title)
									importArray.splice(j, 1);
							}
						}

						var userDrafts = Osp.Core.ArrayHelper.append(importArray, draftArray);

						saveItem.results = userDrafts;

						for(var i = 0; i < userDrafts.length; i++)
						{
							for(var j = 0; j < loadArray.length; j++)
							{
								if(loadArray[j].title == userDrafts[i].title)
									loadArray.splice(j, 1);
							}
						}

						drafts.results = Osp.Core.ArrayHelper.append(loadArray, userDrafts);
					}

					localStorage.setItem("drafting", JSON.stringify(saveItem));

					draftList.removeAllItems();

					for(i = 0; i < drafts.results.length; i++)
					{
						var draftDetails = drafts.results[i];
						var tempItem = self.getItem(draftDetails.title, draftDetails.removable);
						draftList.addItem(tempItem);
					}

					hdObj.setProgressIcon(null);
					var status = Osp.App.AppResource.getString("IDS_LASTIMPORT")+" "+formattedTime;
					localStorage.setItem("settings_laststatus", status);
					self.exportImportStatus.setText(status);
					self.exportButton.setEnabled(true);
					alert(Osp.App.AppResource.getString("IDS_IMPORTSUCCESS"));
				}, function(e)
				{
					console.log("Error: " + e.message);
					hdObj.setProgressIcon(null);
				}, "UTF-8"); 
			}, function(e)
			{
				console.log(e.message);
				hdObj.setProgressIcon(null);
			}, importDir, 'r');
		},

		exportDrafts: function()
		{
			var hdObj = this.headerObj;
			var draftArray = localStorage.getItem("drafting");
			var storage = localStorage.getItem("settings_storage");
			var self = this;
			var today = new Date();
			var param = {
				date : {day : today.getDay(), month : today.getMonth(), year : today.getFullYear()},
				time : {hours : today.getHours(), minutes : today.getMinutes(), seconds : today.getSeconds()},
				style : Osp.Locales.DateTimeStyle.DATE_TIME_STYLE_SHORT
			};
			var formattedTime = Osp.Locales.Formatter.formatDateTime(param);
			var exportDate = today.toLocaleDateString()+" "+today.toLocaleTimeString();
			var documentsDir;
			var dirname;

			if(draftArray != null)
			{
				this.setLoading(true);

				var exportObj = {};
				exportObj.system = "bada";
				exportObj.date = exportDate;
				exportObj.results = JSON.parse(draftArray).results;

				function successCB(files)
				{
					for(i = 0; i < files.length; i++)
					{
						if(files[i].name == 'export.drft')
							documentsDir.deleteFile(function() {console.log("delete successful");}, function (e) {console.log("Error " + e.message);}, files[i].fullPath);
					}

					var exportFile = documentsDir.createFile("export.drft");
					if (exportFile != null)
					{
						exportFile.openStream(function(fs) {
							fs.write(JSON.stringify(exportObj));
							fs.close();

							hdObj.setProgressIcon(null);

							var status = Osp.App.AppResource.getString("IDS_LASTEXPORT")+" "+formattedTime;
							localStorage.setItem("settings_laststatus", status);

							self.exportImportStatus.setText(status);

							alert(Osp.App.AppResource.getString("IDS_EXPORTSUCCESS"));
						},
						function(e)
						{
							console.log("Error: " + e.message);
							hdObj.setProgressIcon(null);
						}, "w", "UTF-8");
					}
				}

				function errorCB(error)
				{
					console.log("The error " + error.message + " occurred when listing the files in the selected folder");
					hdObj.setProgressIcon(null);
				}

				if(storage == "phone")
					dirname = 'documents/smsler';
				else
					dirname = 'removable/Others/smsler';

				deviceapis.filesystem.resolve(function(dir) {documentsDir = dir; dir.listFiles(successCB, errorCB);}, function(e) {console.log("Error: " + e.message); hdObj.setProgressIcon(null);}, dirname, "rw");
			}
			else
				alert(Osp.App.AppResource.getString("IDS_ERROR_NODRAFTS"));
		},

		checkSDCard: function()
		{
			var sdCardCheckButton = this.sdcardCheckButton;

			function checkSuccess(dir)
			{
				console.log("found sdcard");
			}

			function checkFailed(e)
			{
				if(e.message == 'NOT_FOUND_ERR')
					sdCardCheckButton.setEnabled(false);
			}

			deviceapis.filesystem.resolve(checkSuccess, checkFailed, 'removable', "r");
		},

		Encode: function(str)
		{
			return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		},

		Decode: function(value)
		{
			return String(value)
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&');
		}
	}
});