When our app is loading, one of the first things to be shown is the *Splash Screen*.

![DrupalGap Splash Screen](http://drupalgap.org/sites/default/files/splash_0.png)

We can customize the splash screen by editing the [index.html](https://github.com/signalpoint/DrupalGap/blob/7.x-1.x/index.html) file included with our app. Just modify the "Mobile Application Splash Screen" section to include your custom HTML. Be sure to use a unique id when constructing your page container, we recommend something like this:

```
<!-- Mobile Application Splash Screen -->
<div id="_my_mobile_app_splash" data-role="page">
  <div data-role="header" data-theme="b"><h2>My Mobile App</h2></div>
    <div class="ui-content" data-role="content">
    Insert custom HTML here...
  </div>
</div>
```