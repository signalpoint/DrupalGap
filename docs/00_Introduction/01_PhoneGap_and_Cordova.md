## How does PhoneGap work?

[PhoneGap](http://phonegap.com) (and its open source buddy, [Cordova](https://cordova.apache.org/)) takes [HTML](http://www.w3schools.com/html/), [CSS](http://www.w3schools.com/css/) and [JavaScript](http://www.w3schools.com/js/) and compiles it into a mobile application for [Android](http://www.android.com/) and [iOS](https://www.apple.com/ios/) mobile devices (and [many others](http://phonegap.com/about/feature/)).

![How PhoneGap Works](http://drupalgap.org/sites/default/files/phonegap-chart_0.png)

```
<html>
  <body>
      <h1>My Custom App</h1>
      <ul>
        <li><a href="#">Button #1</a></li>
        <li><a href="#">Button #2</a></li>
      </ul>
      <p>Hello World</p>
      <h2>www.example.com</h2>
  </body>
</html>
```

## PhoneGap Features

Via a `JavaScript` API, PhoneGap provides access to mobile device hardware and software features:

- Camera
- GPS
- File System
- Contacts
- Compass
- Accelerometer

## HTML, CSS and JavaScript

If we know the basics of web development, then we can build applications. This also means, our single set of code can be used across multiple mobile platforms.

![A simple PhoneGap app](http://drupalgap.org/sites/default/files/simple-phonegap-app_0.png)

PhoneGap takes our HTML, CSS and JavaScript and compiles it into mobile applications for us, it will look something like the screen shot above. It doesn't look amazing, but if we stop and think about that, it is pretty amazing. Kudos to the PhoneGap team.

At this point, one would typically [choose a CSS Framework](Introduction/CSS_Frameworks) to help style the application to be more visually appealing.