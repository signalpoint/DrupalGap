# A Foundation 6 based theme for DrupalGap 8

## Setup

1. Enable the Foundation Module for DrupalGap: https://github.com/signalpoint/foundation
2. Follow the Foundation Module's README.md: https://github.com/signalpoint/foundation/blob/8.x-1.x/README.md
3. Load the theme in the `<head>` of the `index.html` file, and configure the theme and its blocks in the `settings.js` file:

### index.html
```
<!-- DrupalGap Theme -->
<script src="themes/frank/frank.js"></script>
```

### settings.js
```
// The active theme.
drupalgap.settings.theme = {
  name: 'frank',
  path: 'themes/frank'
};
```
