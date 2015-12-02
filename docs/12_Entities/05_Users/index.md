See the [User Services](../Services/User_Services) page for more information.

## The current user

Once the DrupalGap bootstrap is complete, the current user will be available to your app's source code:

```
var account = Drupal.user.name;
if (account.uid == 0) {
  alert('You are anonymous!');
}
else {
  alert('You are authenticated! Hello, ' + Drupal.user.name);
}
```

It's important to note that the `Drupal.user` object *will not be available* (aka fully loaded) within the `app/settings.js` file.

## user_load()

```
user_load(1, {
    success:function(account) {
      alert("Loaded user " + account.name);
    }
});
```

## user_save()

**Save a New User**

```
var account = {
  name:"bob",
  mail:"bob@hotmail.com",
  pass:"pizza"
};
user_save(account, {
    success:function(result) {
      alert('Created new user #' + result.uid);
    }
});
```

**Update an Existing User**

...


## user_register()

```
var account = {
  name:"bob",
  mail:"bot@example.com"
};
user_register(account, {
    success:function(result) {
      console.log('Registered user #' + result.uid);
    }
});
```

## user_login()

```
user_login("bob", "bobs-password", {
    success:function(result){
      alert('Hi, ' + result.user.name + '!');
    },
    error:function(xhr, status, message){
      alert(message);
    }
});
```

## user_logout()

```
user_logout({
    success:function(result){
      if (result[0]) {
         alert("Logged out!");
      }
    }
});
```