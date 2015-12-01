## Form Element

```
form.elements.my_password_field = {
  title:'Password',
  type:'password'
};
```

## Render Object

```
var content = {
  my_password_field:{
    theme:'password',
    attributes:{
      id:'my_password'
    }
  }
};
```

## theme('password', ...)

```
var html = theme('password', {
  attributes:{
    id:'my_password'
  }
});
```