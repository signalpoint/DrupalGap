Similar to [Adding stylesheets (CSS) and JavaScript (JS) to a Drupal 8 module](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module),
DrupalGap 8 allows you to dynamically attach `.css` and `.js` files as they are needed instead of loading all the
libraries and assets at one time in the `<head>` of the index.html file. This improves front end performance, and should
be used to load external (or internal) libraries on-demand.

## Usage

In the following examples we'll define and use two libraries, one called `friend` and the other called `other_friend`.
We do this by implementing the `libraries()` function in our custom module. Then later when we want to use our friends'
libraries, we attach them to our widgets, and then our friends' assets will will automatically be loaded from e.g.
`friend.com` and `other-friend.com` while our app runs on `example.com` (or in compiled mode).

### Defining a Library

```
my_module.libraries = function() {
  var libraries = {};

  /**
   * LIBRARY #1 - FRIEND
   */

  // Prepare our friend's .js asset.
  var friendJs = {
    _attributes: {
      src: 'https://www.friend.com/friend.js'
    }
  };

  // Prepare our friend's .css asset.
  var friendCss = {
    _attributes: {
      href: 'https://www.friend.com/friend.css'
    }
  };

  // Tell DrupalGap about our friend's assets.
  libraries['friend'] = {
    js: [ friendJs ],
    css: [ friendCss ]
  };

  /**
   * LIBRARY #2 - OTHER FRIEND
   */

  // Prepare our other friend's .js asset.
  var otherFriendJs = {
    _attributes: {
      src: 'https://www.other-friend.com/other-friend.js'
    }
  };

  // Prepare our other friend's .css assets.
  var otherFriendCss = {
    _attributes: {
      href: 'https://www.other-friend.com/other-friend.css'
    }
  };
  var extraCss = {
    _attributes: {
      href: 'https://www.other-friend.com/other-friend-extra.css'
    }
  };

  // Tell DrupalGap about our other friend's assets.
  libraries['other_friend'] = {
    js: [ otherFriendJs ],
    css: [ otherFriendCss, extraCss ]
  };

  // Return our module's library configuration to DrupalGap.
  return libraries;

};

```

Notice how you can include one or more assets in the `js` and `css` properties? With this you can have a library load
multiple `.js` or `.css` files into the DOM when it is used. Just add multiple entries to the `js` or `css` array when
declaring your library in your module's `libraries()` function.

It is **not recommended** to override the `onload` attribute for any of your libraries' assets, as you may experience
unintended consequences. Instead implement `hook_library_onload()` to react to a library being loaded, or add an
`onload` handler to your `_attached` (*see below*).

Also check out `dg.addJs()` and `dg.addCss()` functions in the API for other ways to load `.js` and `.css` assets.


### Attaching a Library to a Render Array

We can then attach a library to any DrupalGap 8 widget using the `_attached` property. Here are some examples using a
plain `_markup` widget.

```

// Within a render element...
element.foo = {

  // Attach our friends' libraries.
  _attached: {
    my_module: ['friend', 'other_friend']
  },

  // When our friends' libraries are loaded, set aside an empty paragraph.
  _markup: '<p id="bar">Knock knock...</p>',

  // When the paragraph is rendered on the screen, take my friend's message and put it in the paragraph, and take my
  // other friend's message and output it with the console log.
  _postRender: [

    function() {
      var paragraph = document.getElementById('bar');
      paragraph.innerHTML = friend.hello();
      console.log(otherFriend.hello());
    }

  ]

};
```

```
// Or as an html string...
var html = dg.render({

  _markup: '...',
  
  _attached: { /* ... */ },
  
  _postRender: [ /* ... */ ]
  
});
```

Notice how you can attach one or more libraries declared by `my_module`? If you want to attach just one library from
`my_module`, you would do:

```
_attached: {
  my_module: ['friend']
}
```

#### Examples for friend.js and other-friend.js

Now imagine your friend's `friend.js` file looked like this:

```
var friend = {
  hello: function() {
    return 'Hello from your friend.';
  }
};
```

And image your other friend's `other-friend.js` file looked like this:

```
var otherFriend = {
  hello: function() {
    return 'Hello from your other friend.';
  }
};
```

Your friend's message of `Hello from your friend.` would show up in the paragraph, and your other friend's message of
`Hello from your other friend.` would show up in the console log. Not only that, but each friend had their `.css`
file(s) loaded into the DOM too.

## hook_library_loaded()

With `hook_library_loaded()` you can react to an individual library being loaded:

```
/**
 * Implements hook_library_onload().
 */
function hook_library_onload(moduleName, libraryName) {

  if (moduleName == 'my_module') {

    if (libraryName == 'friend') {
      console.log('Did you bring the pizza?');
    }
    else if (libraryName == 'other_friend') {
      console.log('Did you bring the beer?');
    }

  }

}
```

## onload()

With an `onload` handler on your `_attached` property, you can react when all the libraries have been loaded:

```
_attached: {
  my_module: ['friend', 'other_friend'],
  onload: function() {
    console.log('Both of my friends are here, let us party!);
  }
}
```
