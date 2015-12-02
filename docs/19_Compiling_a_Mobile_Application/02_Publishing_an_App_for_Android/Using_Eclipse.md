## Import Project into Eclipse

If you haven't already, import the "android" directory from your PhoneGap project into Eclipse:

1. Open Eclipse
2. Go to: File -> Import
3. Choose "Existing Android Code Into Workspace" located under "Android", then click Next
4. Click Browse and locate the "android" directory of your project (e.g. ~/my_app/platforms/android), then click OK
5. Under "Projects to Import", check both boxes, one for your app, and one for "CordovaLib"
6. Do not check "copy projects into workspace" and do not check "Add project to working sets"
7. Click Finish

## App Icons

In your Android project directory, there is a folder called 'res', that is where we will place our app's icon files.

    my-android-project/res/drawable/icon.png (96x96)
    my-android-project/res/drawable-hdpi/icon.png (72x72)
    my-android-project/res/drawable-ldpi/icon.png (36x36)
    my-android-project/res/drawable-mdpi/icon.png (48x48)
    my-android-project/res/drawable-xhdpi/icon.png (96x96)

We recommend creating a high resolution square image for your mobile app's icon, then saving copies of it using the dimensions listed above.

## Export an .APK File

Once you're confident the app is ready for release:

1. Open Eclipse
2. Right click on your app in the "Project Explorer"
3. Select "Export"
4. Under "Android", select "Export Android Application", then click Next
5. Verify your project is listed in the "Project" field, if it isn't click "Browse" to find it, then click Next
6. Select "Use existing keystore" (see the "Create new keystore" section below if you don't have a keystore yet)
7. Click Browse and locate your .keystore file
8. Then enter the keystore password, then click Next
9. Under "Use existing key", verify your .keystore file is selected for "Alias"
10. Enter the keystore password again, then click Next
11. Specify a destination to save the .apk file (e.g. ~/Desktop/MyApp.apk)
12. Click Finish