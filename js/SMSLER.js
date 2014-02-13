Osp.Core.Class.define("SMSLER",
{
	extend : Osp.Core.Object,
	include : [SMSLER.API, SMSLER.Ui],
	construct 	: function(frameObj) 
	{
		this.frameObj = Osp.Ui.Controls.Frame.getInstance();
	},

	members :
	{
		STATE:
		{
			CHECKBOX: null
		},

		LISTENER:
		{
			LIST:
			{
				DRAFTS: null
			}
		},

		drafts : {},

		launch : function()
		{
			// Updater
			if(localStorage.getItem("drafting") != null)
			{
				if(localStorage.getItem("updateInstall") != "done")
				{
					this.completeUpdate();
				}
			}
			this.loadDrafts(); // load preinstalled and user drafts
			this.loadUI(); // load all UI elements
			this.checkSDCard();
		},

		onHeaderAction: function(e)
		{
			switch (e.getData().actionId)
			{
				// add button
				case 20:
					// footer
					this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, false);
					// header
					this.headerObj.setTitleText(Osp.App.AppResource.getString("IDS_NEWDRAFT"));
					this.listButton();
					// Sender
					this.recipentHeadline.setVisible(true);
					this.recipentHeadline.setText(Osp.App.AppResource.getString("IDS_TITLE"));
					this.recipentField.setVisible(false);
					this.msgHeadline.setVisible(true);
					this.msgField.setVisible(true);
					this.msgField.setText("");
					this.sendButton.setVisible(false);
					this.cancelButton.setVisible(true);
					// Draft
					this.draftList.setVisible(false);
					this.draftTitle.setVisible(true);
					this.saveButton.setVisible(true);
					// Settings
					this.settingsScrollPage.setVisible(false);
					break;
				// delete button
				case 21:
					if(this.draftList.hasListener("listItemStateChange"))
							this.draftList.removeListener("listItemStateChange", this.onListAction, this);
					this.draftList.removeAllItems();
					var draftObjects = JSON.parse(localStorage.getItem("drafting")).results;
					for (var i = 0; i < draftObjects.length; i++)
					{
						var draftDetails = draftObjects[i];
						var tempItem = this.getItem(this.Decode(draftDetails.title), draftDetails.removable, 'delete');
						this.draftList.addItem(tempItem);
					}
					// footer
					this.footerObj.removeAllItems();
					this.footerObj.addItem({
						actionId: 5,
						text: Osp.App.AppResource.getString("IDS_BUTTONS_DELETE")
					});
					this.footerObj.addItem({
						actionId: 6,
						text: Osp.App.AppResource.getString("IDS_BUTTONS_CANCEL")
					});
					this.footerObj.setItemSelected(0);
					// header
					this.headerObj.setTitleText(Osp.App.AppResource.getString("IDS_DELETE"));
					this.listButton();
					break;
				// list button
				case 22:
					this.recipentHeadline.setText(Osp.App.AppResource.getString("IDS_RECIPIENT"));
					this.reloadDraftPage();
					if(!this.mainForm.isFooterVisible())
						this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.FOOTER, true);
					break;
				// contact picker
				case 23:
					// contact picker method
					this.pickContacts();
					break;
			}
		},

		onFooterAction: function(e)
		{
			switch (e.getData().actionId)
			{
				// compose page
				case 1:
					// header settings
					this.headerObj.setTitleText("SMS|ER");
					this.headerObj.setTitleTextColor("#FFFFFF");
					this.headerObj.setDescriptionText("");
					this.contactButton();
					// Draft
					this.draftList.setVisible(false);
					this.draftTitle.setVisible(false);
					this.saveButton.setVisible(false);
					// Settings
					this.settingsScrollPage.setVisible(false);
					// Sender
					this.recipentHeadline.setVisible(true);
					this.recipentHeadline.setText(Osp.App.AppResource.getString("IDS_RECIPIENT"));
					this.recipentField.setVisible(true);
					this.msgHeadline.setVisible(true);
					this.msgField.setVisible(true);
					this.msgField.setText("");
					this.sendButton.setVisible(true);
					this.cancelButton.setVisible(true);
					break;
				// draft list page
				case 2:
					// header
					var totalItems = this.draftList.getItemCount();
					this.headerObj.setTitleText(Osp.App.AppResource.getString("IDS_BUTTONS_DRAFTS")+" ("+totalItems+")");
					this.headerObj.setTitleTextColor("#FFFFFF");
					this.headerObj.setDescriptionText("");
					this.addDeleteButton();
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
					this.saveButton.setVisible(false);
					break;
				// settings page
				case 4:
					// header settings
					this.headerObj.removeAllButtons();
					this.headerObj.setTitleText(Osp.App.AppResource.getString("IDS_BUTTONS_SETTINGS"));
					this.headerObj.setTitleTextColor("#FFFFFF");
					this.headerObj.setDescriptionText(Osp.App.AppResource.getString("IDS_APPVERSION")+": "+Osp.App.Application.getAppVersion());
					this.headerObj.setDescriptionTextColor("#FFFFFF");					
					// Sender
					this.recipentHeadline.setVisible(false);
					this.recipentField.setVisible(false);
					this.msgHeadline.setVisible(false);
					this.msgField.setVisible(false);
					this.sendButton.setVisible(false);
					this.cancelButton.setVisible(false);
					// Draft
					this.draftList.setVisible(false);
					this.draftTitle.setVisible(false);
					this.saveButton.setVisible(false);
					// Settings
					this.settingsScrollPage.setVisible(true);
					if(localStorage.getItem("drafting") == null || JSON.parse(localStorage.getItem("drafting")).results == "")
						this.exportButton.setEnabled(false);
					else
						this.exportButton.setEnabled(true);
					break;
				case 5:
					this.onDeleteListAction();
					break;
				case 6:
					this.reloadDraftPage();
					break;
			}
		},

		onButtonAction: function(e)
		{
			switch (e.getData().actionId)
			{
				// send button
				case 10:
					var number = this.recipentField.getText();
					var message = this.msgField.getText();

					if(number == "")
						alert(Osp.App.AppResource.getString("IDS_ERROR_EMPTYFIELDS_RECIPIENTS"));
					else if(message == "")
						alert(Osp.App.AppResource.getString("IDS_ERROR_EMPTYFIELDS_MESSAGE"));
					else
						this.sendMsg(number, message);
					break;
				// cancel button
				case 11:
					if(this.recipentField.getText() != "" || this.msgField.getText() != "" || this.draftTitle.getText() != "")
					{
						config =
						{
							title : 'SMS|ER',
							message : Osp.App.AppResource.getString("IDS_POPUP_CANCELCONFIRM"),
							style : Osp.Ui.Controls.MessageBoxStyle.YES_NO
						};

						var messageBoxObj = new Osp.Ui.Controls.MessageBox(config);

						messageBoxObj.addListener("actionPerform", this.onMessageBoxAction, this);
						messageBoxObj.showAndWait();
					}
					break;
				// save button
				case 12:
					this.saveDraft();
					break;
				case 13:
					this.importDrafts();
					break;
				case 14:
					var storage = localStorage.getItem("settings_storage");
					var dirname;

					if(storage == "phone")
						dirname = 'documents';
					else
						dirname = 'removable/Others';

					function onSuccess(dir)
					{
						dir.createDirectory("smsler");
					}

					function onError(e)
					{
						console.log("Error: " + e.message);
					}

					deviceapis.filesystem.resolve(onSuccess, onError, dirname, "rw");

					this.exportDrafts();
			}
		},

		onMessageBoxAction: function(e)
		{
			if(e.getData().modalResult == 4)
			{
				if(this.draftTitle.isVisible())
					this.draftTitle.setText("");
				else
					this.recipentField.setText("");
				this.msgField.setText("");
			}
		},

		onListAction: function(e)
		{
			this.setLoading(true);

			var listIndex = e.getData().index;
			var selectedItem = this.draftList.getItemAt(listIndex);
			var itemText = selectedItem.setting.elements[1].text;
			var draftArray = this.drafts.results;
			var message;

			for(var i = 0; i < draftArray.length; i++)
			{
				if(itemText == this.Decode(draftArray[i].title))
					message = draftArray[i].text;
			}

			Osp.Core.Function.delay(function()
			{
				// header settings
				this.headerObj.setTitleText("SMS|ER");
				this.headerObj.setTitleTextColor("#FFFFFF");
				this.headerObj.setDescriptionText("");
				this.contactButton();
				// footer
				this.footerObj.setItemSelected(0);
				// Draft
				this.draftList.setVisible(false);
				this.draftTitle.setVisible(false);
				this.saveButton.setVisible(false);
				for(var i = 0; i < this.draftList.getItemCount(); i++)
				{
					if(this.draftList.isItemEnabled(i))
						this.draftList.setItemChecked(i, false);
					if(this.draftList.isItemChecked(i))
						this.draftList.setItemChecked(i, false);
				}
				// Settings
				this.settingsScrollPage.setVisible(false);
				// Sender
				this.recipentHeadline.setVisible(true);
				this.recipentHeadline.setText(Osp.App.AppResource.getString("IDS_RECIPIENT"));
				this.recipentField.setVisible(true);
				this.msgHeadline.setVisible(true);
				this.msgField.setVisible(true);
				this.msgField.setText(this.Decode(message));
				this.sendButton.setVisible(true);
				this.cancelButton.setVisible(true);

				this.setLoading(false);
			}, 500, this);
		},

		onDeleteListAction: function()
		{
			this.setLoading(true);

			var myDrafts = JSON.parse(localStorage.getItem("drafting")).results;
			for(i = this.draftList.getItemCount() - 1; i >= 0; i--)
			{
				if(this.draftList.isItemChecked(i))
				{
					myDrafts.splice(i, 1);
					this.draftList.removeItemAt(i);
					this.draftList.updateList();
				}
			}

			var saveItem = {};
			saveItem.results = myDrafts;

			localStorage.setItem("drafting", JSON.stringify(saveItem));

			this.reloadDraftPage();

			this.setLoading(false);
		},

		onCheckButtonAction: function(e)
		{
			switch (e.getData().actionId)
			{
				// indicator bar
				case 500:
					localStorage.setItem("settings_indicator", "on");
					this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.INDICATOR, true);
					break;
				case 501:
					localStorage.setItem("settings_indicator", "off");
					this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.INDICATOR, false);
					break;
				// contact search	
				case 600:
					localStorage.setItem("settings_contactsearch", "allowed");
					break;
				case 601:
					localStorage.setItem("settings_contactsearch", "disallowed");
					break;
					// contact search	
				case 700:
					localStorage.setItem("settings_listsort", "newFirst");
					break;
				case 701:
					localStorage.setItem("settings_listsort", "standard");
					break;
				case 800:
					localStorage.setItem("settings_storage", "phone");
					break;
				case 801:
					console.log('switch to sdcard');
					break;
				case 900:
					localStorage.setItem("settings_storage", "sdcard");
					break;
				case 901:
					console.log('switch to phone');
					break;
			}
		},
		
		reloadDraftPage: function()
		{
			this.draftList.removeAllItems();
			this.drafts.length = 0;
			this.loadDrafts();
			
			var draftObjects = this.drafts.results;
			for (var i = 0; i < draftObjects.length; i++)
			{
				var draftDetails = draftObjects[i];
				var tempItem = this.getItem(this.Decode(draftDetails.title), draftDetails.removable);
				this.draftList.addItem(tempItem);
			}

			// header
			var totalItems = this.draftList.getItemCount();
			this.headerObj.setTitleText(Osp.App.AppResource.getString("IDS_BUTTONS_DRAFTS")+" ("+totalItems+")");
			this.headerObj.setTitleTextColor("#FFFFFF");
			this.addDeleteButton();
			// footer
			this.footerObj.removeAllItems();
			this.footerObj.addItem({actionId: 1, text: Osp.App.AppResource.getString("IDS_BUTTONS_SENDER")});
			this.footerObj.addItem({actionId: 2, text: Osp.App.AppResource.getString("IDS_BUTTONS_DRAFTS")});
			this.footerObj.addItem({actionId: 4, text: Osp.App.AppResource.getString("IDS_BUTTONS_SETTINGS")});
			// color setup
			this.footerObj.setItemColor({normal: '#18C7E7', pressed: '#0099D2', disabled: '#333333', highlighted: '#18C7E7', selected: '#0099D2'});
			this.footerObj.setItemTextColor({normal: 'white', pressed: 'white', disabled: 'grey', highlighted: 'white', selected: 'white'});
			this.footerObj.setItemSelected(1);
			// Draft
			this.draftList.setVisible(true);
			if(!this.draftList.hasListener("listItemStateChange"))
				this.draftList.addListener("listItemStateChange", this.onListAction, this);
			this.draftTitle.setVisible(false);
			this.saveButton.setVisible(false);
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
			// uncheck the listIndex item of the list
			for(var i = 0; i < totalItems; i++)
			{
				if(this.draftList.isItemEnabled(i))
					this.draftList.setItemChecked(i, false);
				if(this.draftList.isItemChecked(i))
					this.draftList.setItemChecked(i, false);
			}
		}
	}
});