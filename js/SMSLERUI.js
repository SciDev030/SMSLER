Osp.Core.Mixin.define("SMSLER.Ui",
{
	members:
	{
		loadUI: function()
		{
			this.mainForm = new Osp.Ui.Controls.Form({style:Osp.Ui.Controls.FormStyle.INDICATOR | Osp.Ui.Controls.FormStyle.HEADER | Osp.Ui.Controls.FormStyle.FOOTER});
			this.frameObj.addControl(this.mainForm);
			this.frameObj.setCurrentForm(this.mainForm);

			this.createHeader();
			this.createFooter();
			this.createSenderPage();
			this.createDraftPage();
			this.createSettingsPage();
		},

		createHeader: function()
		{
			this.headerObj = this.mainForm.getHeader();
			this.headerObj.setColor("#18C7E7");
			// listener
			this.headerObj.addListener("actionPerform", this.onHeaderAction, this);
		},

		createFooter: function()
		{
			// init footer
			this.footerObj = this.mainForm.getFooter();
			// general settings
			this.footerObj.setFooterStyle('tab');
			this.footerObj.setColor("#18C7E7");
			// add items
			this.footerObj.addItem({actionId: 1, text: Osp.App.AppResource.getString("IDS_BUTTONS_SENDER")});
			this.footerObj.addItem({actionId: 2, text: Osp.App.AppResource.getString("IDS_BUTTONS_DRAFTS")});
			this.footerObj.addItem({actionId: 4, text: Osp.App.AppResource.getString("IDS_BUTTONS_SETTINGS")});
			// color setup
			this.footerObj.setItemColor({normal: '#18C7E7', pressed: '#0099D2', disabled: '#333333', highlighted: '#18C7E7', selected: '#0099D2'});
			this.footerObj.setItemTextColor({normal: 'white', pressed: 'white', disabled: 'grey', highlighted: 'white', selected: 'white'});
			// listener
			this.footerObj.addListener("actionPerform", this.onFooterAction, this);
		},

		createSenderPage: function()
		{
			this.headerObj.setTitleText("SMS|ER");
			this.headerObj.setTitleTextColor("#FFFFFF");
			this.contactButton();

			var mainFormY = this.mainForm.getClientAreaBounds().y;

			if(mainFormY == 72)
			{
				this.recipentHeadline = new Osp.Ui.Controls.Label({bounds: {x: 30, y: 30, width: 420, height: 35}, text: Osp.App.AppResource.getString("IDS_RECIPIENT")});
				this.recipentField = new Osp.Ui.Controls.EditField({bounds: {x: 30, y: 70, width: 420, height: 78}, limitLength: 1000, editFieldStyle: "text", groupStyle: "single", enableClear: true, showTitle: false});
				this.draftTitle = new Osp.Ui.Controls.EditField({bounds: {x: 30, y: 70, width: 420, height: 78}, limitLength: 20, editFieldStyle: "text", groupStyle: "single", enableClear: true, showTitle: false});
				
				this.msgHeadline = new Osp.Ui.Controls.Label({bounds: {x: 30, y: 160, width: 420, height: 35}, text: Osp.App.AppResource.getString("IDS_MESSAGE")});
				this.msgField = new Osp.Ui.Controls.EditArea({bounds: {x: 30, y: 200, width: 420, height: 330}, limitLength: 1000});

				this.sendButton = new Osp.Ui.Controls.Button({bounds: {x: 30, y: 545, width: 200, height: 60}, text: Osp.App.AppResource.getString("IDS_BUTTONS_SEND"), actionId: 10});
				this.cancelButton = new Osp.Ui.Controls.Button({bounds: {x: 250, y: 545, width: 200, height: 60},text: Osp.App.AppResource.getString("IDS_BUTTONS_CANCEL"), actionId: 11});
				this.saveButton = new Osp.Ui.Controls.Button({bounds: {x: 30, y: 545, width: 200, height: 60}, text: Osp.App.AppResource.getString("IDS_BUTTONS_SAVE"), actionId: 12});
			}
			else
			{
				this.recipentHeadline = new Osp.Ui.Controls.Label({bounds: {x: 30, y: 20, width: 420, height: 35}, text: Osp.App.AppResource.getString("IDS_RECIPIENT")});
				this.recipentField = new Osp.Ui.Controls.EditField({bounds: {x: 30, y: 60, width: 420, height: 78}, limitLength: 1000, editFieldStyle: "text", groupStyle: "single", enableClear: true, showTitle: false});
				this.draftTitle = new Osp.Ui.Controls.EditField({bounds: {x: 30, y: 60, width: 420, height: 78}, limitLength: 20, editFieldStyle: "text", groupStyle: "single", enableClear: true, showTitle: false});

				this.msgHeadline = new Osp.Ui.Controls.Label({bounds: {x: 30, y: 150, width: 420, height: 35}, text: Osp.App.AppResource.getString("IDS_MESSAGE")});
				this.msgField = new Osp.Ui.Controls.EditArea({bounds: {x: 30, y: 190, width: 420, height: 270}, limitLength: 1000});

				this.sendButton = new Osp.Ui.Controls.Button({bounds: {x: 30, y: 475, width: 200, height: 60}, text: Osp.App.AppResource.getString("IDS_BUTTONS_SEND"), actionId: 10});
				this.cancelButton = new Osp.Ui.Controls.Button({bounds: {x: 250, y: 475, width: 200, height: 60}, text: Osp.App.AppResource.getString("IDS_BUTTONS_CANCEL"), actionId: 11});
				this.saveButton = new Osp.Ui.Controls.Button({bounds: {x: 30, y: 475, width: 200, height: 60}, text: Osp.App.AppResource.getString("IDS_BUTTONS_SAVE"), actionId: 12});
			}

			this.recipentHeadline.setTextSize(34);
			this.recipentHeadline.setTextWeight('bolder');

			this.recipentField.setTextSize(30);	
			this.recipentField.addListener("textValueChange", this.searchContact, this);

			this.draftTitle.setTextSize(30);

			this.msgHeadline.setTextSize(34);
			this.msgHeadline.setTextWeight('bolder');

			this.msgField.setTextSize(30);

			this.sendButton.addListener("actionPerform", this.onButtonAction, this);
			this.cancelButton.addListener("actionPerform", this.onButtonAction, this);
			this.saveButton.addListener("actionPerform", this.onButtonAction, this);

			this.mainForm.addControl(this.recipentHeadline);
			this.mainForm.addControl(this.recipentField);
			this.mainForm.addControl(this.draftTitle);
			this.mainForm.addControl(this.msgHeadline);
			this.mainForm.addControl(this.msgField);
			this.mainForm.addControl(this.sendButton);
			this.mainForm.addControl(this.saveButton);
			this.mainForm.addControl(this.cancelButton);

			this.saveButton.setVisible(false);
			this.draftTitle.setVisible(false);
		},

		createDraftPage: function()
		{
			var mainFormY = this.mainForm.getClientAreaBounds().y;

			if(mainFormY == 72)
				this.draftList = new Osp.Ui.Controls.List({bounds: {x: 0, y: 0, width: 480, height: 614}, itemDivider: true, fastScroll: false});
			else 
				this.draftList = new Osp.Ui.Controls.List({bounds: {x: 0, y: 0, width: 480, height: 549}, itemDivider: true, fastScroll: false});

			var draftObjects = this.drafts.results;
			for (var i = 0; i < draftObjects.length; i++)
			{
				var draftDetails = draftObjects[i];
				var tempItem = this.getItem(this.Decode(draftDetails.title), draftDetails.removable);
				this.draftList.addItem(tempItem);
			}

			this.mainForm.addControl(this.draftList);
			this.draftList.setVisible(false);
		},

		createSettingsPage: function()
		{
			var mainFormY = this.mainForm.getClientAreaBounds().y;

			if(mainFormY == 72)
				this.settingsScrollPage = new Osp.Ui.Controls.ScrollPanel({bounds:{x:0, y:0, width:480, height:614}});
			else
				this.settingsScrollPage = new Osp.Ui.Controls.ScrollPanel({bounds:{x:0, y:0, width:480, height:549}});

			// design
			this.designHeadline = new Osp.Ui.Controls.Label({bounds: {x: 10, y: 30, width: 460, height: 35}, text: Osp.App.AppResource.getString("IDS_DESIGN")});
			this.designHeadline.setTextSize(34);
			this.designHeadline.setTextWeight('bolder');

			// indicator
			this.indicatorBarCheckButton = new Osp.Ui.Controls.CheckButton({bounds: {x:10,y:80,width:460,height:50}, style: Osp.Ui.Controls.CheckButtonStyle.ONOFF, groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE, backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT, text: Osp.App.AppResource.getString("IDS_STATUSBAR")});
			this.indicatorBarCheckButton.setActionId(500, 501, 502);
			this.indicatorBarCheckButton.addListener('actionPerform', this.onCheckButtonAction,this);

			var settings_indicator = localStorage.getItem("settings_indicator");
			if(settings_indicator == null || settings_indicator == "on")
			{
				this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.INDICATOR, true);
				this.indicatorBarCheckButton.setSelected(true);
			}
			else
				this.mainForm.setActionBarsVisible(Osp.Ui.Controls.FormStyle.INDICATOR, false);

			// options
			this.optionsHeadline = new Osp.Ui.Controls.Label({bounds: {x: 10, y: 190, width: 460, height: 35}, text: Osp.App.AppResource.getString("IDS_OPTIONS")});
			this.optionsHeadline.setTextSize(34);
			this.optionsHeadline.setTextWeight('bolder');

			// contact search
			this.contactSearchCheckButton = new Osp.Ui.Controls.CheckButton({bounds: {x:10,y:240,width:460,height:50}, style: Osp.Ui.Controls.CheckButtonStyle.ONOFF, groupStyle: Osp.Ui.Controls.GroupStyle.TOP, backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT, text: Osp.App.AppResource.getString("IDS_CONTACTSEARCH")});
			this.contactSearchCheckButton.setActionId(600, 601, 602);
			this.contactSearchCheckButton.addListener('actionPerform', this.onCheckButtonAction,this);

			var settings_contactsearch = localStorage.getItem("settings_contactsearch");
			if(settings_contactsearch == "allowed")
				this.contactSearchCheckButton.setSelected(true);

			// list sort
			this.listSortCheckButton = new Osp.Ui.Controls.CheckButton({bounds: {x:10,y:301,width:460,height:50}, style: Osp.Ui.Controls.CheckButtonStyle.ONOFF, groupStyle: Osp.Ui.Controls.GroupStyle.BOTTOM, backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT, text: Osp.App.AppResource.getString("IDS_LISTSORT")});
			this.listSortCheckButton.setActionId(700, 701, 702);
			this.listSortCheckButton.addListener('actionPerform', this.onCheckButtonAction,this);

			var settings_listsort = localStorage.getItem("settings_listsort");
			if(settings_listsort == "newFirst")
				this.listSortCheckButton.setSelected(true);

			// export/import
			this.exportImportHeadline = new Osp.Ui.Controls.Label({bounds: {x: 10, y: 406, width: 460, height: 35}, text: Osp.App.AppResource.getString("IDS_BACKUP")});
			this.exportImportHeadline.setTextSize(34);
			this.exportImportHeadline.setTextWeight('bolder');

			// phone/sdcard buttons
			this.phoneCheckButton = new Osp.Ui.Controls.CheckButton({bounds: {x:10,y:456,width:220,height:50}, style: Osp.Ui.Controls.CheckButtonStyle.MARK, groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE, backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT, text: Osp.App.AppResource.getString("IDS_PHONE")});
			this.phoneCheckButton.setActionId(800 , 801, 802);
			this.sdcardCheckButton = new Osp.Ui.Controls.CheckButton({bounds: {x:240,y:456,width:220,height:50}, style: Osp.Ui.Controls.CheckButtonStyle.MARK, groupStyle: Osp.Ui.Controls.GroupStyle.SINGLE, backgroundStyle: Osp.Ui.Controls.BackgroundStyle.DEFAULT, text: Osp.App.AppResource.getString("IDS_SDCARD")});
			this.sdcardCheckButton.setActionId(900 , 901, 902);
			this.radioGroupObj = new Osp.Ui.Controls.RadioGroup();
			this.radioGroupObj.add(this.phoneCheckButton);
			this.radioGroupObj.add(this.sdcardCheckButton);

			var settings_storage = localStorage.getItem("settings_storage");
			if(settings_storage == "sdcard")
				this.radioGroupObj.setSelectedItem(this.sdcardCheckButton);
			else
			{
				localStorage.setItem("settings_storage", "phone");
				this.radioGroupObj.setSelectedItem(this.phoneCheckButton);
			}

			this.phoneCheckButton.addListener('actionPerform', this.onCheckButtonAction,this);
			this.sdcardCheckButton.addListener('actionPerform', this.onCheckButtonAction,this);

			this.importButton = new Osp.Ui.Controls.Button({bounds: {x: 10, y: 525, width: 220, height: 60}, text: Osp.App.AppResource.getString("IDS_IMPORT"), actionId: 13});
			this.exportButton = new Osp.Ui.Controls.Button({bounds: {x: 240, y: 525, width: 220, height: 60}, text: Osp.App.AppResource.getString("IDS_EXPORT"), actionId: 14});

			this.importButton.addListener("actionPerform", this.onButtonAction, this);
			this.exportButton.addListener("actionPerform", this.onButtonAction, this);

			this.exportImportStatus = new Osp.Ui.Controls.Label({bounds: {x: 10, y: 590, width: 460, height: 35}, text: ""});
			this.exportImportStatus.setTextSize(26);
			this.exportImportStatus.setTextColor("#666666");
			if(localStorage.getItem("settings_laststatus") != null)
				this.exportImportStatus.setText(localStorage.getItem("settings_laststatus"));

			this.mainForm.addControl(this.settingsScrollPage);
			// add elements to main form
			this.settingsScrollPage.addControl(this.designHeadline);
			this.settingsScrollPage.addControl(this.indicatorBarCheckButton);
			this.settingsScrollPage.addControl(this.optionsHeadline);
			this.settingsScrollPage.addControl(this.contactSearchCheckButton);
			this.settingsScrollPage.addControl(this.listSortCheckButton);
			this.settingsScrollPage.addControl(this.exportImportHeadline);
			this.settingsScrollPage.addControl(this.phoneCheckButton);
			this.settingsScrollPage.addControl(this.sdcardCheckButton);
			this.settingsScrollPage.addControl(this.importButton);
			this.settingsScrollPage.addControl(this.exportButton);
			this.settingsScrollPage.addControl(this.exportImportStatus);
			// set visible to false on start up
			this.settingsScrollPage.setVisible(false);
		},

		addDeleteButton: function()
		{
			this.headerObj.removeAllButtons();
			this.headerObj.setButton("left", {actionId: 20, icon: {normal: './images/add.png', pressed: './images/add_pressed.png'}});
			this.headerObj.setButtonColor({normal: '#0AB0DA', pressed: '#18C7E7'});
			this.headerObj.setButton("right", {actionId: 21, icon: {normal: './images/delete.png', pressed: './images/delete_pressed.png'}});
			this.headerObj.setButtonColor({normal: '#0AB0DA', pressed: '#18C7E7'});
		},

		listButton: function()
		{
			this.headerObj.removeAllButtons();
			this.headerObj.setButton("left", {actionId: 22, icon: {normal: './images/list.png', pressed: './images/list_pressed.png'}});
			this.headerObj.setButtonColor({normal: '#0AB0DA', pressed: '#18C7E7'});
		},

		contactButton: function()
		{
			this.headerObj.removeAllButtons();
			this.headerObj.setButton("left", {actionId: 23, icon: {normal: './images/contact.png', pressed: './images/contact_pressed.png'}});
			this.headerObj.setButtonColor({normal: '#0AB0DA', pressed: '#18C7E7'});
		},

		setLoading: function(boolean)
		{
			var hdObj = this.headerObj;
			if(boolean)
				hdObj.setProgressIcon("./images/loading.gif");
			else
				hdObj.setProgressIcon(null);
		},

		getItem: function(title, removable, ui)
		{
			var style = Osp.Ui.Controls.ListAnnexStyle.RADIO;
			if(ui == 'delete')
				style = Osp.Ui.Controls.ListAnnexStyle.MARK;
			var item = {height: 60,	setting: {backgroundColor: {normal: '#000000', pressed: '#000000'}, annex: style, elements: []}};

			if(removable == "no")
				item.setting.elements.push({image: {normal: {src: "./images/lock.png", bounds: {x: 10, y: 5, width: 50, height: 50}}, pressed: {src: "./images/lock.png", bounds: {x: 10, y: 5, width: 50, height: 50}}}});
			else
				item.setting.elements.push({image: {normal: {src: "./images/unlock.png", bounds: {x: 10, y: 5, width: 50, height: 50}}, pressed: {src: "./images/unlock.png", bounds: {x: 10, y: 5, width: 50, height: 50}}}});

			item.setting.elements.push({bounds: {x: 70, y: 0, width: 410, height: 60}, text: title, selectable: false, textSize: 30, textColor: {normal: '#FFFFFF', pressed: '#FFFFFF'}, textSliding: false});

			return item;
		}
	}
});