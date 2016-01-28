## Option 1

### Using the DrupalGap CLI

The quickest way to create a theme is using the DrupalGap CLI. Try this command to quickly create a directory and file to power the theme:

```
cd app
./dg create theme foo
```

Then follow the instructions printed to the terminal screen (*see steps 4-6 below*).

## Options 2

### Manually Creating a Theme

#### 1. Create a directory:

First, create a directory to store the theme's files:

```
app/themes/foo
```

#### 2. Create a javascript file

Then create a `.js` file with a name that *matches* the name of the directory, for example:

```
app/themes/foo/foo.js
```

#### 3. Build the theme's regions

In `foo.js`, make a constructor for the theme (the capitalized `Foo` is not a typo), and add 3 regions to it:

```
// The foo theme constructor.
dg.themes.Foo = function() {

  // The theme's regions.
  this.regions = {
    header: { },
    content: { },
    footer: { }
  };
  
};

// Extend the DrupalGap Theme prototype.
dg.themes.Foo.prototype = new dg.Theme;
dg.themes.Foo.prototype.constructor = dg.themes.Foo;
```

#### 4. Load the theme

Open the `index.html` file, and load the theme's `.js` file in the `<head>` like so:

```
<script src="themes/foo/foo.js"></script>
```

Be sure it is placed after the `drupalgap.js` file and any module `.js` files.

#### 5. Configure the settings.js file

Open up the `settings.js` file and tell DrupalGap to use this new theme:

```
// The active theme.
drupalgap.settings.theme = {
  name: 'foo',
  path: 'themes/foo'
};
```

#### 6. Add blocks to the regions

Also in the `settings.js` file, you can then add blocks to the regions:

```
drupalgap.settings.blocks.foo = {
  header: {

    // DrupalGap's administration menu block.
    admin_menu: {
      roles: [
        { target_id: 'administrator', visible: true }
      ]
    }

  },
  content: {
  
    // DrupalGap's page title block.
    title: { },

    // DrupalGap's main content block.
    main: { }

  },
  footer: {

    // The powered by DrupalGap block.
    powered_by: { }

  }
};
```

The `admin_menu`, `title`, `main`, and `powered_by` blocks are all system blocks provided by DrupalGap. You may [create your own custom blocks](../Blocks/Create_a_Custom_Block) if needed.
