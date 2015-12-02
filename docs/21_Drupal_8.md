> This page is incomplete.

Welcome to the DrupalGap 8 getting started guide.

## 1. Enable Module Dependencies

In Drupal 8, we'll be using Drupal core's **Web Services** modules. Go to:

**Manage -> Extend** (`admin/modules`)

Under the **Web Services** module package fieldset, enable these modules.

- HTTP Basic Authentication
- RESTful Web Services
- Serialization
- HAL

For security reasons, it is ***highly recommended*** your site has **https**.

We'll also be using this contrib module, enable it as well:

- [REST UI](https://drupal.org/project/restui)

## 2. Set Up User Permissions

Go to `admin/people/permissions` and set these permissions, for example:

![Drupal 8 User Permissions](http://drupalgap.org/sites/default/files/Screenshot%20from%202014-02-24%2017%3A18%3A27.png)

## 3. Configure Rest

First, go to:

**Configuration -> Web services -> Rest** (`admin/config/services/rest`)

Then enable the **User** resource. Then enable the following:

**GET / POST**
- Supported formats: **hal_json**
- Authentication providers: **basic_auth**

## Configuration Settings

After enabling the required modules, copy your active config to your staging directory if you haven't already:

Open the `rest.settings.yml` file in the staging directory:

1. change all **supported_formats** from **hal_json** to **json**
2. change all **supported_auth** values from **basic_auth** to **cookie**

Then go to **Configuration management** (`admin/config/development/configuration`) and **Import all** changes.