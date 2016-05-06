## Debugging iOS PhoneGap Apps with Safari's Web Inspector and cordova simulator

### Enable Safari’s Develop Menu
On your desktop or laptop, open Safari’s Preferences and click on the Advanced tab. Check the box to **Show Develop menu in menu bar**.

![Develop Menu Bar](http://drupalgap.com/sites/default/files/develop-menu-bar.png)

### Run emulator
```
$ cordova emulate ios
```

### Start Web Inspector
Launch your app either in the iOS simulator or on a physical device. If you are using a physical device you’ll need to connect it to your desktop or laptop with the standard USB cable. Once the app has launched, switch to Safari, **select the Develop menu item**, then find the entry corresponding to the web page you want to debug.

![Web Inspector](http://drupalgap.com/sites/default/files/web-inspector.png)