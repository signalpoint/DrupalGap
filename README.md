An application development kit for Drupal websites, built with Angular JS.

# WARNING - 7.x-2.x

This branch is highly experimental and unstable as we completely rebuild the
DrupalGap engine to work with Angular JS. For a production ready DrupalGap,
check out the default 7.x-1.x branch and releases built on top of jQuery Mobile:

 - https://github.com/signalpoint/DrupalGap

# DOCS

 - http://drupalgap.org/angular

# INSTALLATION

## 1. Enable DrupalGap 7.x-2.x Module

On your Drupal site, enable the DrupalGap 7.x-2.x module:

 - http://drupal.org/project/drupalgap

## 2. drupalgap.json

On your Drupal site, navigate to `http://example.com/drupalgap/connect` as an
admin. Then in your browser, click File -> Save, and then save this JSON output
to a file in your app's directory:

```
app/js/drupalgap.json
```

