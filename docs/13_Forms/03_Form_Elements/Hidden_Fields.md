## Form Element

```
form.elements.my_hidden_field = {
  type:'hidden',
  default_value:'secret_sauce'
};
```

## Render Array

```
var content = {
  my_hidden_field:{
    theme:'hidden',
    attributes:{
      id:'my_secret',
      value:'secret_sauce'
    }
  }
};
```

## theme('hidden', ...)

```
var html = theme('hidden', {
  attributes:{
    id:'my_secret',
    value:'secret_sauce'
  }
});
```