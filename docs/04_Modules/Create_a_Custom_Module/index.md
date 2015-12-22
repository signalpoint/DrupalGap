To create a custom module in DrupalGap, follow these steps:

## 1. Create the module skeleton
Use the `DrupalGap CLI` to create a module skeleton:
```
./drupalgap.sh create module my_module
```

## 2.Add it to index.html
Open the `index.html` file and include your module's `.js` file *after* the `drupalgap.js` (or `drupalgap.min.js`) file:
```
<script type="text/javascript" charset="utf-8" src="app/modules/custom/my_module/my_module.js"></script>
```

## 3.Add it to settings.js
Tell jDrupal about the custom module by adding it to the `app/settings.js` file:

```
jDrupal.modules.custom['my_module'] = {};
```
