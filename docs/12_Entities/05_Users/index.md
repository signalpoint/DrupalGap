## The current user

Once the DrupalGap bootstrap is complete, the current user will be available to your app's source code:

```
// Grab the current user account.
var user = jDrupal.currentUser();
var msg = user.isAuthenticated() ?
  'Hello ' + user.getAccountName() :
  'Hello World';
```

It's important to note that the `jDrupal.currentUser()` function *will not be available* within the `settings.js` file, because the app hasn't bootsrapped itself by that time.

## Load a User Account

```
jDrupal.userLoad(456).then(function(account) {
  var msg = 'Loaded : ' + account.getAccountName();
  console.log(msg);
});
```

## Save a User Account

### Save a New User

```
...
```

### Update an Existing User

```
...
```


## Register a New User

This will become available in Drupal 8.3.0

```
...
```

## user_login()

```
jDrupal.userLogin('bob', 'secret').then(function() {
  console.log('Logged in!');
});
```

## user_logout()

```
jDrupal.userLogout().then(function() {
  console.log('Logged out!');
});
```
