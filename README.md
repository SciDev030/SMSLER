SMSLER
======

Source Code of the bada App SMS|ER

# Requirements to build an app

* badaSDK 2.0.0 or higher
* account on developer.bada.com
* a manifest.xml

# manifest.xml privilegs
To use all features of the app you have to add follow privilegs for manifest.xml
* MESSAGING
* ADDRESSBOOK
* SYSTEM_SERVICE
* WEB_SERVICE (default)

**Hint: You have to create a manifest for a WebApp**

# HowTo: build an app

1. Open badaSDK and create a new "bada Web Project"
2. Delete all files of the folder "Res"
3. Extract all files of the SMS|ER Source Code zip <WORKSPACE_PATH>/<YOUR_PROJECT>/Res
3.1. You can also import the files through the badaSDK
4. Import your manifest.xml from developer.bada.com

# Supported devices

The source code runs perfect on bada devices with bada 2.0 if they have minimum resolution of 320x480.
On SamsungApps WebApps only available for Wave 3, Wave M and Wave Y.