
## Connect to Externally Hosted Drupal Site

It is possible to develop your mobile app using localhost inside of Google Chrome with Ripple, and have your Drupal site hosted externally.

For example, say you wanted to develop your app using localhost here:

`var/www/mobile-application`

But at the same time, the Drupal website you want to connect to is hosted somewhere on the Internet, for example:

`http://www.example.com`

By default, we will not be able to connect to example.com from localhost because of built in web security (in all modern browsers) that prevent "Cross Site Request Forgery" attempts.

To get around this, we can launch Google Chrome from a terminal with a flag to disable this securtiy feature.

Note, before running this terminal command, close all other instances of your Google Chrome browser first.

***Warning*** (*SECURITY NOTICE*), do not navigate anywhere but your localhost in the browser after running this terminal command. Malicious sites could cause you problems with this security feature disabled.

`google-chrome --disable-web-security`

Now if we navigate to the localhost mobile app:

`http://localhost/mobile-application`

And then "Disable" the "Cross Domain Proxy" under "Settings" in Ripple, we should be able to connect to example.com from our localhost app.

### Using Mac OSX

In the `Terminal` app:

`open -a Google\ Chrome --args --disable-web-security`

### Using Windows

Find google chrome right click on it and view properties.  Then copy the path of the location including the `.exe`. Mine looked like this `C:\Users\myusername\AppData\Local\Google\Chrome\Application\chrome.exe`.  You have to use this in the following commands.

`C:\Users\myusername\AppData\Local\Google\Chrome\Application\chrome.exe --disable-web-security`

## HOW TO STOP

To stop browsing in this mode just close the browser and open a new one.