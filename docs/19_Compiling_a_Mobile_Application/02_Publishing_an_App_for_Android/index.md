### Getting Ready

```
cd ~/phonegap/my_app
ls -la
```

You should see the default files and directories from the cordova create and cordova platform add commands used during the PhoneGap installation:

- config.xml
- hooks/*
- platforms/*
- plugins/*
- www/*

### Preparing the App's Icons

```
cd ~/phonegap/my_app/platforms/android/res
ls -la
```

Here you'll see many directories:

- drawable
- drawable-hdpi
- drawable-ldpi
- ...

Using your favorite image editor, overwrite the icon.png file in each of the directories with the icon that you'd like to use for the app. Pay close attention to the original dimensions, because your icon.png files must use those same dimensions for each folder.

- my-android-project/res/drawable/icon.png (96x96)
- my-android-project/res/drawable-hdpi/icon.png (72x72)
- my-android-project/res/drawable-ldpi/icon.png (36x36)
- my-android-project/res/drawable-mdpi/icon.png (48x48)
- my-android-project/res/drawable-xhdpi/icon.png (96x96)
- my-android-project/res/drawable-xxhdpi/icon.png (144x144)
- my-android-project/res/drawable-xxxhdpi/icon.png (192x192)

## Using the Terminal to Compile the App

Once you're ready to compile your app for Android, it's pretty easy using terminal commands. When we're done you'll have a `.apk` file that can be installed on Android devices.

### Preparing

```
cd ~/phonegap/my_app
```

The www directory will contain the DrupalGap SDK, your app directory, the `index.html` file, etc:

- www/bin/drupalgap.min.js
- www/index.html
- www/app/*
- ...

Don't forget to place a copy of `cordova.js` in the www directory:

`cp platforms/android/assets/www/cordova.js www/`

Then update `index.html` to include the `cordova.js` file before the `drupalgap_onload()` call:

```
<!-- Load PhoneGap (Cordova) -->
<script type="text/javascript" src="cordova.js"></script>
```

Change the DrupalGap mode in your `settings.js` file:

`drupalgap.settings.mode = 'phonegap';`

### Connecting your Android device

Plugin your Android device via USB to your computer, and then turn on debug mode on the Android device. You should then be able to the Android device connected to your computer's USB list:

`lsusb`

It will look something like this (and will most likely contain your phone manufacturer's name):

`Bus 003 Device 019: ID 1004:61f1 LG Electronics, Inc.`

### Compiling the .apk file

Now we're ready to compile and run the app:

`cordova run android`

This will automatically compile and install the app on your Android device. If you do not have an Android device, you can run this command instead:

`cordova build`

Once compiled, the Android app can be shared by sending an `.apk` file to colleagues or friends:

`~/phonegap/my_app/platforms/android/ant-build/CordovaApp-debug.apk`

This `.apk` file is only used for debugging/testing, and cannot be published to the Google Play store.

### Sharing the .apk file with testers

At this point, the `.apk` file can be simply sent to an e-mail address, and the recipient can install the app directly from the GMail app on their Android device. Of course only share this with trusted contacts as a means to test out your app.

### Preparing the .apk for Google Play

The `.apk` file compiled above cannot be used in Google Play, so we need to prepare it for submission. The following terminal commands will prepare an .apk file so you can upload it to the Google Play Developer Console. While following along, you may use your own app's name in place of things like "my_app", etc.

First, specify a unique version number in the `config.xml` file:

`~/phonegap/my_app/config.xml`

The version number will look something like this:

`<widget id="com.example" version="1.0.0" other="stuff" />`

Next, create a **keystore** (only once):

```
cd ~/phonegap/my_app
keytool -genkey -v -keystore my_app.keystore -alias my_app -keyalg RSA -keysize 2048 -validity 10000
```

Follow the prompts and enter all the information it asks for and be sure to take note of the password you specify because you will need it below.

Then create a `release-signing.properties` file in the `platforms/android` directory and add this to it:

```
storeFile=/my-absolute-path-to-keystore/my_app.keystore
storePassword=secret
storeType=jks
keyAlias=my_app
keyPassword=secret
```

Be sure to replace both occurrences of `secret` with your passwords, and replace `my_app` with the alias to your app.

Now you can compile a signed release using this terminal command:

```
cordova build android --release
```

That's it! The `android-release.apk` file can now be uploaded to the Google Play Developer Console:

`~/phonegap/my_app/platforms/android/build/outputs/apk/my_app.apk`
