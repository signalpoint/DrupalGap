> Important before continuing: 

- You must follow the **Preparing directions** under **Using the Terminal** on [this page](../Publishing_an_App_for_Android) before continuing.
- You must do a `sudo cordova build android` (if not on a mac, remove `sudo`) before you will have be able to import the project.

## Import Project into Android Studio

If you haven't already, import the "android" directory from your PhoneGap project into Android Studio:

1. Open Android Studio
2. From the Welcome Screen Select "Import project (Eclipse ADT, Gradle, etc.)"
3. Click Browse and locate the "android" directory of your project (e.g. ~/my_app/platforms/android), then click OK
4. It will automatically build your Andriod app using gradle 
5. In the left side bar click Project and then select the android folder
6. **Don't build your project yet using the build dropdown menu or you will get errors**
7. Instead go back to the Terminal or command line and run "sudo cordova run android" (if not on a mac remove sudo)
  - This might fail and that is ok if the fail says something like "ERROR : No emulator images (avds) found." or "WARNING : No target specified, deploying to emulator"
  - If either of those happen it did build the app and updated your changes.

## Testing your App

1. Once the app is in android studio
2. Go to the drop down menu and select "Run" and then "Run 'Android'".
- If this fails because of an error "ERROR: Unable to open class file ~/my_app/platforms/android/../../../R.java: Permission denied"
- FIX: Go to the top of the platform android folder "~/my_app/platforms/android/"

#### Mac:

- right click and select "get info"
- click the lock in the bottom right hand corner
- enter your login password to approve the changes
- Under sharing and permission make sure that all the names have "Read & Write".
- At the very bottom of the "get info" box there is a gear with a drop down arrow.  Click the drop down and "Apply to enclosed items"
- A Dialog box will appear asking if you are sure you want to apply these changes to all subfolders.  Click "OK"

#### Windows:

- right click and select "properties"
- make sure Read-only is not boxed out or checked
- Hit apply
- Makes sure that when prompted to apply changes to this folder and subfolders and files that you allow it to effect everything under that

2a. Try again Go to the drop down menu and select "Run" and then "Run 'Android'"
3. Choose a Device dialog box will popup.  Select Launch emulator and select a virtual device then hit ok.
4. It will load the Virtual Device and load your app right up.
5. Test away!

## App Icons

In your Android project directory, there is a folder called 'res', that is where we will place our app's icon files.

    my-android-project/res/drawable/icon.png (96x96)
    my-android-project/res/drawable-hdpi/icon.png (72x72)
    my-android-project/res/drawable-ldpi/icon.png (36x36)
    my-android-project/res/drawable-mdpi/icon.png (48x48)
    my-android-project/res/drawable-xhdpi/icon.png (96x96)
    my-android-project/res/drawable-xxhdpi/icon.png (144x144)
    my-android-project/res/drawable-xxxhdpi/icon.png (192x192)

We recommend creating a high resolution square image for your mobile app's icon, then saving copies of it using the dimensions listed above.

## Export an .APK File

Once you're confident the app is ready for release:

1. Open Android Studio
2. Select "Build" from the dropdown
3. Select "Generate Signed APK..."
4. Select the android module
5. Locate the existing "Choose Existing" or "Create a New" one.(see the "Create new keystore" section below if you don't have a keystore yet)
6. Enter the Key Store Password, Alias, and Password you used to created new keystore.
7. check remember passwords
8. hit "next"
9. Enter Mast Password - Password created for keystore
10. Make sure Build Type is set to "release"
11. Click finish
12. When prompted hit "Reveal in Finder" this will help you locate the file.
13. It will most likely be called "android-release.apk" you can change that to your "myapp.apk"
14. Now you are ready to publish that app to the google play store or side load it onto a device for real testing