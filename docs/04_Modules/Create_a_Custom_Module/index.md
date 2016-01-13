To create a custom module in DrupalGap, follow these steps:

## 1. Create the module skeleton

Use the `DrupalGap CLI` to create a module skeleton:

`./drupalgap.sh create module my_module`

Or you can manually create a module by creating a directory and `.js` file for it:

`app/modules/custom/my_module/my_module.js`

Then add this line of code to `my_module.js`:

`dg.modules.my_module = new dg.Module();`

## 2.Add it to index.html

Open the `index.html` file and include your module's `.js` file *after* the `drupalgap.js` (or `drupalgap.min.js`) file:

```
<script src="app/modules/custom/my_module/my_module.js"></script>
```

## 3. Done

Next, try [creating a custom route to display a page](../Pages/Creating_a_Custom_Page).
