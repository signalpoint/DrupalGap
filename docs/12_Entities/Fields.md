## Supported Fields

DrupalGap aims to provide support for all core fields, and many popular contributed module fields. Check out the [DrupalGap modules listing](http://drupalgap.org/project/modules) to add support for a contributed field in your app.

## Adding Support for a Field / Widget

There are many contributed modules that provide custom fields for us. In order to utilize these custom fields in our apps, we'll need the corresponding module for DrupalGap. If it doesn't yet exist, support can be added for it with some effort.

If you're going to implement support for a field, it is 100% recommended to do so in your browser using a DrupalGap web app, or mobile app via Chrome + Ripple on a freshly installed Drupal website. By developing in the browser, development can go so much faster than doing so in an emulator or by compiling to your device. When developing, please continually ask yourself "Will this work for other Drupal websites?", and try to develop it so others can enjoy the fruits of your labor.

### 1. Determine module machine name

First, what module did you install that provided this custom field? You must get the machine name of that module. To do so, navigate to the project's home page on d.o, for example:

`https://drupal.org/project/date`

In this example, the machine name of the module is date. Take note of the module's machine name for which you would like to support.

### 2. Create a GitHub repository for the module

If this module doesn't yet exist for DrupalGap ([browse modules](http://drupalgap.org/project/modules)), go to [GitHub](https://github.com/) and create a repository with the exact same machine name as the contribued module. For example, when we added support for the Date field in DrupalGap, we created a repository called date. It is very important to make your repository publicly available on GitHub. As an open source community, this is the absolute best way to collaborate and improve projects for everyone.

### 3. Create a project page on drupalgap.org

Next, please [create a project page](http://drupalgap.org/node/add/project) on this site, to immediately let others know that you've begun developing this module. This will allow others to easily fork your repository, and contribute back to your efforts.

### 4. Implement the module and the necessary DrupalGap SDK hooks

Use `hook_field_formatter_view()` to add support for the field when viewing an entity.

Use `hook_field_widget_form()` to add support for the field when creating/editing an entity.

Use `hook_assemble_form_state_into_field()` to tell DrupalGap how to build the JSON for the REST calls.

For example usage of these hooks, checkout some of the [modules](http://drupalgap.org/project/modules) that have been added to support popular contributed fields.

### 5. Enable the module in your app

Add your module to the `app/modules` directory, and then add its **machine name** to the `settings.js` file's contrib module section.