To create a custom module in DrupalGap, follow these steps:

## 1. Create the module skeleton

It's *highly recommended* you choose a name for your module that is prefixed with your project's name (or initials), that way your module doesn't collide with any one else. 

### Option a

Use the [DrupalGap CLI](../Developer_Guide/CLI_-_Command_Line_Interface) to create a module skeleton:

```
./dg create module my_module
```
### Option b

Or manually create a `.js` file and copy/paste this snippet into it:

`app/modules/custom/my_module/my_module.js`

```
// Create the module and attach it to DrupalGap.
var my_module = new dg.Module();
dg.modules.my_module = my_module;
```

## 2.Add it to index.html

Open the `index.html` file and include your module's **.js** file *after* the `drupalgap.min.js` file:

```
<script src="modules/custom/my_module/my_module.js"></script>
```

## 3. Done

Next, try [creating a custom route to display a page](../Pages/Creating_a_Custom_Page).
