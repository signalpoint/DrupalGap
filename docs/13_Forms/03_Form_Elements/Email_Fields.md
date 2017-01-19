## Form Element

```
form.my_email_field = {
  _title: dg.t('Email Address'),
  _type: 'email',
  _default_value: 'foo@bar.com'
};
```

## Render Array

```
var content = {
  my_email_field:{
    _theme: 'email',
    _attributes: {
      value: 'foo@bar.com'
    }
  }
};
```

## dg.theme('email', ...)

```
var html = dg.theme('email', {
  _attributes: {
    value: 'foo@bar.com'
  }
});
```
