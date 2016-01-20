With the [jQuery Mobile Textinput](https://api.jquerymobile.com/textinput/) Widget, we can create text fields and text areas in our app.

- [See the Textfield Form Element Page](../Forms/Form_Elements/Text_Fields)
- [See the Textarea Form Element Page](../Forms/Form_Elements/Text_Areas)

## Text Field

![Text Field Widget](http://drupalgap.org/sites/default/files/textfield-widget.png)

### Render Element

```
var content = {};
content['my_text_field'] = {
  theme: 'textfield',
  attributes: {
    value: 'Hello'
  }
};
return content;
```

### dg.theme('textfield', ...)

```
var html = dg.theme('textfield', {
  attributes: {
    value: 'Hello'
  }
});
return html;
```

## Text Area

![Text Area Widget](http://drupalgap.org/sites/default/files/textarea-widget.png)

### Render Element

```
var content = {};
content['my_textarea'] = {
  theme: 'textarea',
  value:'Hello'
};
return content;
```

### dg.theme('textarea', ...)

```
var html = dg.theme('textarea', { value: 'Hello' });
return html;
```