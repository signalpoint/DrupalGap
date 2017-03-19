We can either create a single checkbox, or multiple checkboxes for our users. Also checkout the [Checkbox Widget](../../Widgets/Checkbox_Widget) page.

## Single Checkbox

When creating a form, we can add a single checkbox to it:

### Form Element

```
form.pizza = {
  _title: dg.t('Enjoy pizza?'),
  _type: 'checkbox',
  _description: 'Check this box if you enjoy pizza.',
  _default_value: 1 /* a value of 1 checks the box */
};
```

## Multiple Checkboxes

Alternatively, when creating a form we can also provide multiple checkboxes that are grouped together:

### Form Element

```
form.pizza_toppings = {
  _title: dg.t('Pizza Toppings'),
  _type: 'checkboxes',
  _required: true,
  _options: {
    ham: 'Ham',
    pineapple: 'Pineapple',
    bacon: 'Bacon'
  }
};
```

### Checking Multiple Checkboxes

Use the option key(s) as the key value pairs on `_default_value` to have the boxes be checked by default:

```
_default_value: {
  ham: 'ham',
  pineapple: 'pineapple',
}
```
