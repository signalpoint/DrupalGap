With DrupalGap 8, it's easy to set aside variables (a name/value pair) in local storage so that those values can be
retrieved later, even after an application is restarted.

> Related topic, [Configuration Forms](Forms/Config_Forms).

It's recommend to prefix your variable names with the machine name of your module, followed by an underscore. In the
following examples we want a variable `foo` to exist within our module's namespace, so we set up the variable name as
`my_module_foo` so:

## Setting a Variable

```
var foo = {
  'bar': 'chew',
  'moo': [
    'milk',
    'cheese'
  ]
};
dg.setVar('my_module_foo', foo);
```

## Getting a Variable

```
var foo = dg.getVar('my_module_foo');
dg.alert(foo.bar); // Alerts 'chew'.
```

## Deleting a Variable

```
dg.deleteVar('my_module_foo');
```

## Getting a Variable and Setting a Default

```
var example = dg.getVar('my_module_example', true);
```
This will automatically set aside `true` in local storage for the value of `my_module_example`, that way others can
pick up that value, without you having to make a call to `dg.setVar()`. This is optional, and merely for convenience.
