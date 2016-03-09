### Applying jQueryMobile to the Mobile App

By using jQuery Mobile, a few div containers, and the `data-role` attribute, our simple page is transformed into a slick mobile app interface:

![A simple jQuery Mobile app](http://drupalgap.org/sites/default/files/jquerymobile-transformation.png)

```
<html>

  <head><!-- jQueryMobile includes go here --></head>

  <body>

    <div data-role="page">

      <div data-role="header"><h1>My Custom App</h1></div>

      <div data-role="navbar"><ul>
        <li><a href=”#”>Button #1</a></li>
        <li><a href=”#”>Button #2</a></li>
      </ul></div>

      <div data-role="content"><p>Hello World</p></div>

      <div data-role="footer"><h2>www.example.com</h2></div>

    </div><!-- page -->

  </body>
</html>
```

That's great, but...

What if we wanted to create another page in our app with the same header, navigatoin bar and footer, but with a different content area?

![Multi page app](http://drupalgap.org/sites/default/files/many-pages.png)

Would we copy and paste the page HTML, then modify only small chunks of HTML on the new page? We could do that, but if our app has many pages, this will become a nightmare to maintain.