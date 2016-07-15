> Developer tip, careful with symbolic links within an iOS project, xCode and Emulators may fail to start.

This page is based on [Apple's Official Documentation](https://developer.apple.com/library/ios/documentation/LanguagesUtilities/Conceptual/iTunesConnect_Guide/Chapters/ReplacingYourAppWithANewVersion.html#//apple_ref/doc/uid/TP40011225-CH14).

After you initially publish your app, you'll most likely want to improve upon your app and release new versions of it. Updating your App for iOS app is similar to some aspects of the initial publication of the App, except there is much less to do, and there are some new options that can be set:

1. What's New in this Version
2. Version Release Control (when the release will become available)
3. iCloud availability

If you run into any problems during this procedure, try these tride and true techniques:

1. Restart your computer
2. Make sure your mac OS and xCode are up to date
3. Start / Stop the Emulator
4. Product -> Clean

With that being said, we're ready to get started. Assuming you've already programmed the changes you want to release, and your updated App is running on an Emulator in xCode, let's first tell iTunes Connect about the new release:

1. Go to [http://itunesconnect.apple.com](http://itunesconnect.apple.com/) and sign in
2. Go to "Manage Your Apps"
3. Click on your App under "Recent Activity", or use "Search" to locate your App
4. In the "Versions" section, click "Add Version"
5. Enter your new "Version Number", e.g. 1.1
6. Enter details about "What's New in this Version", keep it simple
7. Click "Save"

The app should now be in the "Prepare for Upload" status.

1. Click the "Ready to Upload Binary" button
2. Select the appropriate radio buttons for the "Export Compliance" and "Previous Purchase Restrictions"
3. Click "Continue"
4. Select your preferred "Version Control Release" radio button
5. Click "Save"

Now head back to xCode and then:

1. Click on your project in the left side bar
2. Go to: Product -> Archive
3. Wait for the archive build to complete...
4. Click the "Distribute" button (in the "Organizer - Arhives")
5. Select the "Submit to the iOS App Store" radio button,
6. Click "Next"
7. Enter your login credentials if necessary, then click "Next"
8. Select your "Provisioning Profile"
9. Click "Submit"
10. Sit back and relax while the app is uploaded...

Once it is completed, you may retire because you should be a billionaire by tomorrow, if Apple approves your updates ;)