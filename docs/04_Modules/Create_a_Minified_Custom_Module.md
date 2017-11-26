With most applications, your custom module will become very large and it will be easier to maintain the module across
multiple files. The DrupalGap 8 CLI has built in support for Gulp which allows us to have a `src` directory containing
many different files to power our module, and then it compiles them all down into a single e.g. `my_module.min.js` file.
This has many advantages, and is recommended over the traditional `my_module.js` approach.

```
./dg create module my_module --gulp
cd modules/custom/my_module
sudo npm install
gulp
```

This will build the `my_module.min.js` file for you. Gulp will watch for changes you make to the files in the `src`
directory and then rebuild the mini .js file automatically. You only need to run the `sudo npm install` one time. The
`gulpfile.js` that comes with the module is set up to watch for changes to files like this:

```
src/includes/include.*.js
src/blocks/block.*.js
src/forms/form.*.js
src/pages/page.*.js
src/widget/widget.*.js
```

You can freely modify the `gulpfile.js` to meet your needs, the above files/folders can be used to get started though.
