## Examples

- [Build a Mobile App to Geo Locate Nearby Places with Drupal](http://tylerfrankenstein.com/code/build-mobile-app-geo-locate-content-drupal)
- [Build a Mobile App to Geo Tag a Photo](http://tylerfrankenstein.com/code/build-mobile-app-geo-tag-photo)

## PhoneGap GeoLocation Plugin

Refer to [PhoneGap's Geolocation](https://github.com/apache/cordova-plugin-geolocation/blob/master/doc/index.md) documentation for more information.

To use Geo Location features on your mobile device, an Android Emulator, or an iOS Simulator, make sure you have the plugin installed within your PhoneGap environment:

```
cordova plugin add cordova-plugin-geolocation
cordova plugin save
```

If you're using Ripple for development, you can [simulate a Geo Location with Ripple](Geo_Location/Simulate_Geo_Location_in_Ripple), without the plugin mentioned above.

## Contributed Modules

There are a few contributed modules for DrupalGap that have offer started work on typical Geo Location features:

- [Address Field](https://drupal.org/project/addressfield)
- [Geofield](https://drupal.org/project/geofield)
- [Location](https://drupal.org/project/location)

### iOS 8

Apple made some changes in iOS 8 that make some of the location stuff pretty tricky.  Basically you have to add certain entries to the Info.plist to explain *why* your app is using location information, and the app has to explicitly request location authorization before it can get any information.  In the past just querying for location information would implicitly trigger a prompt to the user.
