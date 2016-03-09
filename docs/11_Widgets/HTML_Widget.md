Sometimes we just want to use plain old custom HTML when building a widget. Luckily this is possible using a render array, or a string:

### Render Array (recommended)

```
var content = {};
content['my_markup'] = {
  markup: '<p>My Custom HTML</p>'
};
return content;
```

### String

```
var content = '<p>My Custom HTML</p>';
return content;
```

## Handling Inline Javascript

Refer to [this page](../Pages/Page_Events/Inline_JavaScript) for more information on placing custom JavaScript inline with custom HTML.