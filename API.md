# DrupalGap API

  http://api.drupalgap.org

## The DrupalGap API is generated using:

  https://github.com/jsdoc3/jsdoc

## We use a forked copy of the JSDOC repo:

  https://github.com/signalpoint/jsdoc

## This command can be used to re-generate the API:

```
cd ~/Desktop/github-code/jsdoc
./jsdoc ~/Desktop/github-code/DrupalGap/src/drupalgap.js ~/Desktop/github-code/DrupalGap/src/includes/*.js ~/Desktop/github-code/DrupalGap/src/modules/*/*.js ~/Desktop/github-code/jDrupal/src/*.js ~/Desktop/github-code/jDrupal/src/*/*.js
```

After re-generating the API, delete all the files from www/api on the server,
then upload the contents of the 'out' directory to the server.

# drupalgap.min.js

When generating the drupalgap.min.js file, the web service based closure
compiler has a file size limit that we are exceeding. Therefore we install
the closure compiler app locally:

https://developers.google.com/closure/compiler/faq#size-restrictions
https://developers.google.com/closure/compiler/docs/gettingstarted_app

This app requires JDK7, and you can use the following terminal command to switch
between java versions:

```
sudo update-alternatives --config java
```

FYI, we were running JDK6 in Ubuntu prior to this, so when using Eclipse for
Android, we may have to switch back to 6 from 7.

The following command can be used to make the minifed JS file:

```
cd ~/Desktop/github-code/closure-compiler/
java -jar compiler.jar --js /var/www/headless-drupal/drupal/mobile-application/bin/drupalgap.js --js_output_file /var/www/headless-drupal/drupal/mobile-application/bin/drupalgap.min.js
```

# daux.io

We're now using daux.io to generate documentation from markdown files.