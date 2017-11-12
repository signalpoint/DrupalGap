This doc describes how to create a custom module in DrupalGap 8.

> It's *highly recommended* you choose a name for your module that is prefixed with your project's name (or initials), that way your module doesn't collide with any one else.

## Option A

Use the [DrupalGap CLI](../Developer_Guide/CLI_-_Command_Line_Interface) to create a module skeleton:

```
./dg create module my_module
```

## Option B

### 1. Create the module skeleton

Or manually create a `.js` file and copy/paste this snippet into it:

`app/modules/custom/my_module/my_module.js`

```
// Create my module.
dg.createModule('my_module');
```

### 2. Add it to index.html

Open the `index.html` file and include your module's **.js** file *after* the `settings.js` file:

```
<script src="modules/custom/my_module/my_module.js"></script>
```

## After Option A or B...

Next, try [creating a custom route to display a page](Pages/Creating_a_Custom_Page).
