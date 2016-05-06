Assuming you already have a Drupal 7 website set up, this page describes how to install the DrupalGap SDK alongside [PhoneGap](http://phonegap.com/) (Cordova).

## 1. Install node.js

Install [node.js](http://nodejs.org/) for your preferred operating system's development environment.

### Ubuntu

```
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
```

### Other Operating Systems

See [here](https://github.com/joyent/node) and [here](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) for more information.

## 2. Install Cordova

After installing node.js, use this terminal command to install Cordova:

`npm install -g cordova`

## 3. Complete a PhoneGap Platform Guide

Complete a [platform guide](https://cordova.apache.org/docs/en/latest/guide/platforms/index.html) for your first desired platform. We recommend following the platform guide for whichever platform runs on your personal mobile device (Android, iOS, etc).

Be sure to follow the complete platform guide your first time. If you've already completed the platform guide, then you can go ahead with these terminal commands:

```
cd ~/Desktop
cordova create ExampleApp com.example "ExampleApp"
cd ExampleApp
```

Now that we've created an empty app, let's add a platform to it and build (prepare) the app.

#### Android

```
cordova platform add android
cordova build
```

You may have to run this command to get the cordova build command to work properly:

`source ~/.bash_profile`

A typical `.bash_profile` will have things look a bit like this:

```
export ANDROID_HOME=/home/tyler/android-sdk-linux
export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64
export PATH=${PATH}:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:/usr/share/npm
```

#### iOS

```
cordova platform add ios
cordova prepare
```

### Quick Test

Now that the empty app is built, we can test it to verify everything is going smooth so far.

#### Android

`cordova run android`

The Android device must be connected to your computer via USB and have the "USB Debugging "option enabled under the device's "Developer Options" settings.

#### iOS

Double click this .xcodeproj file to open the project in xCode:

`~/Desktop/ExampleApp/platforms/ios/ExampleApp.xcodeproj`

In xCode, select an "iPhone" simulator, then click the "Run" button to open the app.

## 4. Install PhoneGap (Cordova) Plugins

Now that we've created and tested an empty app. Let's add some [Cordova plugins](http://plugins.cordova.io/#/_browse/all).

Here are the required plugins, install them with this single terminal command:

`cordova plugin add cordova-plugin-console cordova-plugin-device cordova-plugin-dialogs cordova-plugin-file cordova-plugin-inappbrowser cordova-plugin-network-information`

Then to update your `config.xml` file, run this terminal command:

`cordova plugin save`

Anytime you add or remove plugins from your app, be sure to run this command again.

### Other recommended Plugins

There are a few other plugins that are common to many mobile apps, feel free to install them like we did above:

`cordova plugin add cordova-plugin-camera cordova-plugin-geolocation`

Again, update your `config.xml` file with this command:

`cordova plugin save`

Now that we've successfully completed the platform guide for PhoneGap, we're now ready to place DrupalGap on top of the app.

## 5. Install the DrupalGap SDK over PhoneGap

If you built a web app, you can click the "download" link on your Drupal site under "Configuration -> Web services -> DrupalGap". Extract the contents of this download into PhoneGap's www directory so it overwrites many of the files that come with PhoneGap's test app:

`~/Desktop/ExampleApp/www`

Then open your app's `settings.js file`, and switch the mode to phonegap:

`drupalgap.settings.mode = 'phonegap';`

**VERY IMPORTANT** Then include the `cordova.js` file in the body of your `index.html` file.

```
<!-- Load PhoneGap (Cordova) -->
<script type="text/javascript" src="cordova.js"></script>
```

See [manually installing the DrupalGap SDK on top of PhoneGap]() for more details.

## 6. Run the Mobile App

Navigate back the app's root directory:

`cd ~/Desktop/ExampleApp`

### Android

```
cordova build
cordova run android
```

## iOS

After running the build/prepare commands below, re "Run" the project in xCode.

```
cordova build
cordova prepare
```

If all goes well, the app will load and you'll be connected to your Drupal website!

## 7. Try your Mobile App

![DrupalGap Dashboard](http://www.drupalgap.org/sites/default/files/dashboard_2.png)

If you run into any problems, visit the [troubleshooting](../../Install/Troubleshoot) and [support](http://drupalgap.org/support) pages.

From here we recommend continuing with the [Hello World](../../Hello_World) guide or viewing topics in the Getting Started Guide to customize your mobile app. Good luck, and happy coding!

## 8. Remove Unnecessary Files (Optional)

The PhoneGap Platform Guide installation will leave a few directories that we no longer need, you may delete them:

```
cd ~/Desktop/ExampleApp/www
rm -rf img/ js/
```
