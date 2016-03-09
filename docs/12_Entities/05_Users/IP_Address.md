It is possible to obtain the IP address of the current user with this function, for example:

```
var ip = drupalgap_get_ip();
alert(ip);
```

The IP address is populated with the most recent call to System Connect (e.g. when the app first starts, when the user logs in/out, etc) and is provided by [$_SERVER['REMOTE_ADDR']](http://www.php.net//manual/en/reserved.variables.server.php) from PHP. This means the IP can be considered fairly accurate in most use cases, but don't let your life depend on it because malicious users may be able to fake this value.
