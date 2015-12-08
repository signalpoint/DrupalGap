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
4. Go to: Developer Program Resources => iTunes Connect => Submit and manage your apps on the App store
5. Login with your Developer credentials (if prompted, again)

### 3a. Create a Bundle ID

Now that we're at the 'Member Center', we need to create a Bundle ID:

1. Click 'Manage Your Apps'
2. Click 'Add New App'
3. Under the 'Bundle ID' drop down menu, click the link to register a new 'Bundle ID'.
4. Now that we're on the 'Registering an App ID' page, [Click here to learn how to Create a Bundle ID](Publishing_an_App_for_iOS/Registering_a_new_Bundle_ID).

### 3b. Create a New App and Enter Information

Now that we've created a Bundle ID, go back to the Member Center home page and then:

1. Under 'App Store Distribution' and 'iTunes Connect' click on 'Submit and manage your apps on the App store' link
2. Click 'Manage Your Apps'
3. Click 'Add New App'
4. Select the 'Default Language'
5. Enter the 'App Name'
6. Enter the 'SKU Number'
7. Select the 'Bundle ID' we created earlier
8. Click 'Continue'

### 3c. Select Availability Date and Pricing Options

1. Select your App's "Availability Date"
2. Select your App's "Price Tier"
3. Check/Uncheck the "Discount for Educational Institutions" depending on your App's needs
4. Click 'Continue'

### 3d. Specify the Version Information

1. Enter 'Version Number', for example: 1.0
2. Enter 'Copyright' info
3. Select the 'Primary Category' for your App
4. Select the 'Secondary Category for your App (optional)
5. Under 'Rating', select the appropriate 'Apple Content Descriptions' radio buttons for your App
6. Check the "Made for Kids" box if your app is designed for children

### 3e. Enter Meta Data

Under the 'Metadata' section, enter the:

1. Description
2. Keywords
3. Support URL
4. Marketing URL (optional)
5. Privacy Policy URL (optional)

### 3f. Enter Contact Information

Under 'Contact Information', enter:

1. First Name
2. Last Name
3. Email Address
4. Phone Number
5. Optionally enter any 'Review Notes' and/or 'Demo Account Information' for your App
6. If you have an 'EULA', you may add it now

### 3g. Upload App Icons and Screenshot(s)

Next up, under the 'Uploads' section press the 'Choose File' button for each item and select the appropriate file(s). You must upload at least one screen shot for 3.5 inch and 4 inch retina displays.

1. Large App Icon
2. 3.5 Inch Retina Display Screenshots
3. 4 Inch Retina Display Screenshots
4. iPad Screenshots
5. Routing App Coverage File (optional)
6. Click 'Save'

Finally we'll be at the 'App Information' screen with a summary of everything we've just done. Our App Status should be 'Prepare for Upload', now go ahead and click the 'Done' button.

## 4. Ready to Upload Binary

1. Inside of iTunes Connect and under 'Manage Your Apps', click on the application icon for the app.
2. Then click the "View Details" button inside the "Versions" section.
3. Click the 'Ready to Upload Binary' button.
4. Select Yes/No for the "Export Compliance"
5. Select Yes/No for the "Content Rights"
6. Click "Save"
7. Then click "Continue" after reading the paragraphs of text

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
4. Enter your e-mail address you use for your Apple developer account
5. Enter the "Comman Name" field (e.g., John Doe Dev Key)
6. Select the "Saved to disk" radio button
7. Click "Continue"
8. Save the certificate to your Desktop
9. With the Finder, double click the CSR on your Desktop
10. Under "File", select "Open CSR"
11. For "Issuing CA" select "Let me choose", then click "Continue"
12. Select "Request a certificate from an existing CA", then click "Continue"
13. Click "Create"
14. Click "Done"

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
11. Make sure xCode is already open
12. Then go to your Downloads folder and open the ".mobileprovision" file, this will open it in the "Organizer" in xCode
13. Verify the certificate is valid (you should see a green check icon if it is valid)

## 7. Product Archive (Compiling for Release)

We're finally ready to upload our app to Apple.

1. Open xCode
2. Next to the "Run" and "Stop" buttons, locate a drop down menu
3. Select "MyProject -> iOS Device"
4. Go to Product -> Archive
5. Wait for the archival to complete...
6. Click the "Distribute" button (in the Organizer - Archives)
7. Select the "Submit to the iOS App Store" radio button, then click 'Next'
8. Fill in your login credentials if necessary
9. Select your "Application"
10. Select your "Code Signing Identity"
11. Click "Next"

At this point, if the Apple folks agree, your app will move into the "Waiting For Review" stage. Now just sit back, relax, and give yourself a pat on the back for making it this far! :)

Congratulations, your app is in review, keep your fingers crossed that Apple likes your app ;)