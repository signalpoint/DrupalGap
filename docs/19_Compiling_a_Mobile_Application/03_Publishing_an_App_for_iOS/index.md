> Developer tip, careful with symbolic links within an iOS project, xCode and Emulators may fail to start.

## 0. Install PhoneGap

If you haven't already, [install PhoneGap for iOS](../Preparing_PhoneGap/Installing_PhoneGap).

## 1. Create Application Icons

First, create icon graphics for the mobile app, and place them in this iOS project directory:

`MyProject/Resources/icons`

    icon-72@2x.png (144x144)
    icon-72.png (72x72)
    icon.png (57x57)
    icon@2x.png (114x114)

## 2. Create Splash Screen Graphics

Next, create splash screen graphics for the mobile app and place them in this directory:

`MyProject/Resources/splash`

We recommend creating the the splash screen images without transparency:

    Default-568h@2x~iphone.png (640x1136)
    Default-Landscape@2x~ipad.png (2048x1496)
    Default-Landscape~ipad.png (1024x748)
    Default-Portrait@2x~ipad.png (1536x2008)
    Default-Portrait~ipad.png (768x1004)
    Default@2x~iphone.png (640x960)
    Default~iphone.png (320x480)
    
## 2a. Set up iO7 Status Bar (optional)

For more information, [see here](http://devgirl.org/2014/07/31/phonegap-developers-guid/).

First add the plugin with the terminal:

`cordova plugin add org.apache.cordova.statusbar`

Then add preferences like this inside the `<widget>...</widget>`in your
`config.xml` file:

```
<preference name="StatusBarOverlaysWebView" value="false" /> 
<preference name="StatusBarBackgroundColor" value="#000000" />
<preference name="StatusBarStyle" value="lightcontent" />
```

## 3. Set up App for Release

Next we need to set up the mobile application for release:

1. Go to [https://developer.apple.com](https://developer.apple.com/)
2. Go to "Member Center"
3. Login with your Developer credentials (if prompted)
4. Click on iTunes Connect
5. Login with your Developer credentials (if prompted, again)

### 3a. Create a Bundle ID

Now that we're at `iTunes Connect`, we need to create a `Bundle ID`:

1. Click `My Apps`
2. Click `+` -> `New App`
3. Click `Register one here` to create a new `Bundle ID`
4. Follow [these instructions](Publishing_an_App_for_iOS/Registering_a_new_Bundle_ID)

### 3b. Create a New App and Enter Information

Now that we've created a Bundle ID, go back to `iTunes Connect` and then:

1. Click `My Apps`
2. Click `+` -> `New App`
3. Enter info in all the fields
7. Select the `Bundle ID` we created earlier
8. Click `Create`

### 3c. Select Availability and Pricing Options

1. Click on `Pricing and Availability`
2. Select the App's `Price Schedule`
3. `Edit` the availability of the app, if necessary
4. Choose the appropriate radio button for the `Volume Purchase Program`
5. Click `Save`

## 4. Prepare for Submission

1. Click on `1.0 Prepare for Submission`
2. Fill out this page in its entirety, clicking `Save` along the way

The mobile application is now ready to be uploaded. Next, we'll create a certificate.

## 5. Create Certificate

[This video](http://www.youtube.com/watch?v=rRlOdp4uZoo) is very similar to below, and walks you through step by step and really helped.

1. Go to the "Member Center" at developer.apple.com
2. Click "Manage your certificates, App IDs, devices, and provision profiles" under the "Certificates, Identifiers & Profiles" section
3. Click "Certificates" in the "iOS Apps" column
4. Click the + icon to add a new one
5. Select the "App Store and Ad Hoc" radio button in the "Production" section, click "Continue"

At this point, you may be prompted to "Create a Certificate Signing Request (CSR)". Follow the on screen instructions provided by Apple. The instructions should resemble these steps:

1. On your Mac, go to: Finder -> Applications -> Utilities
2. Launch the "Keychain Access.app"
3. Go to: Keychain Access -> Certificate Assistant -> Request a Certificate From a Certificate Authority
4. Enter your e-mail address you use for your **Apple Developer Account** (not your iTunesConnect developer account email address, which may be different if you release apps on a client's behalf)
5. Enter the "Common Name" field (e.g., John Doe Dev Key)
6. Select the "Saved to disk" radio button
7. Click "Continue"
8. Save the certificate to your Desktop
9. Click **done**

Now that the CSR has been generated and saved to the Desktop, go back to the "Create a Certificate Signing Request" in your browser's window.

1. Click the "Continue" button
2. Click "Choose File" and locate the CSR saved on your Desktop
3. Click "Generate"
4. Click "Download"
5. Click on the Certificate in your Download folder
6. Verify the new Certificate is listed under "My Certificates" inside "Keychain Access"
7. Click "Done" in your browser
8. Verify the new Certificate is listed in the "iOS Certificates" section under "Certificates, Identifiers & Profiles"

Next, we'll create a provisioning profile.

## 6. Create Provisioning Profile

1. Go to the "Member Center" at developer.apple.com
2. Click "Manage your certificates, App IDs, devices, and provision profiles" under the "Certificates, Identifiers & Profiles" section
3. Click "Provisioning Profiles" in the "iOS Apps" column
4. Click the + icon to add a new one
5. Select the "App Store" radio button in the "Distribution" section, click "Continue"
6. Select your "App ID" from the drop down menu (this will be the Bundle ID you created earlier), click "Continue"
7. Select the radio button for the desired certificate, click 'Continue'
8. Enter a Profile Name, then click the 'Generate' button
9. Click the 'Download' button
10. Click Done
11. Make sure xCode project is already open
12. Then go to your Downloads folder and open the ".mobileprovision" file, this will open it in the "Organizer" in xCode
13. Verify the certificate is valid (you should see a green check icon if it is valid)

## 7. Product Archive (Compiling for Release)

We're finally ready to upload our app to Apple.

1. Open xCode
2. Go to Product -> Destination -> iOS Device
4. Go to Product -> Archive
5. Wait for the archival to complete...
6. Click the "Distribute" button (in the Organizer - Archives)
7. Select the "Submit to the iOS App Store" radio button, then click 'Next'
8. Fill in your login credentials if necessary
9. Select your "Application"
10. Select your "Code Signing Identity"
11. Click "Next"

At this point, if the Apple folks agree, your app will move into the "Waiting For Review" stage. Now just sit back, relax, and give yourself a pat on the back for making it this far!

Congratulations, your app is in review, keep your fingers crossed that Apple likes your app ;)
