## Form Element

```
form.elements.my_email_field = {
  title:'Email Address',
  type:'email',
  default_value:'foo@bar.com'
};
```

## Render Array

```
var content = {
  my_email_field:{
    theme:'email',
    attributes:{
      value:'foo@bar.com'
    }
  }
};
```

## theme('email', ...)

```
var html = theme('email', {
  attributes:{
    value:'foo@bar.com'
  }
});
```