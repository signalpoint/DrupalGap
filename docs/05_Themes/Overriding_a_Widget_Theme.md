It's possible to override any widget's theme using a custom module.

For example, to override the default checkbox widget's theme:

1. Copy [dg.theme_checkbox()](https://github.com/signalpoint/DrupalGap/blob/8.x-1.x/src/includes/forms/form-input.inc.js)
2. Paste and rewrite it as...

```
/**
 * Implements theme_checkbox().
 */
function example_checkbox(vars) {

  // Paste dg.theme_checkbox()'s function implementation here.
  // Make any adjustments.
  // Return the html.

}
```

The two main places where you can find widget theme functions are...

- [form-input.inc.js](https://github.com/signalpoint/DrupalGap/blob/8.x-1.x/src/includes/forms/form-input.inc.js)
- [widgets/](https://github.com/signalpoint/DrupalGap/tree/8.x-1.x/src/widgets)

For now, only modules can override widgets.
