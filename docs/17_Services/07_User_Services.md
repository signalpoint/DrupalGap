See the [Users](../Entities/Users) page for more information.

## Login

**Example Result**

```
{
    "sessid": "elnW3f9M1GuCsQq8VOvg1ILlnXspUkDmqDuCGoApeMg",
    "session_name": "SESSdf38f2ca29b2ae21094041b608a8af74",
    "user": {
        "uid": "3",
        "name": "bob",
        "theme": "",
        "signature": "",
        "signature_format": "filtered_html",
        "created": "1355285904",
        "access": "1358207211",
        "login": 1358222684,
        "status": "1",
        "timezone": "America/New_York",
        "language": "",
        "picture": null,
        "data": false,
        "roles": {
            "2": "authenticated user"
        },
        /* ... */
    }
}
```

## Register

**Example Result**

```
{
  "uid":"3",
  "uri":"http://www.example.com/drupalgap/?q=drupalgap/user/3"
}
```

## Retrieve

- only users with the 'View user profiles' permission must be enabled for this to work
- unless the user making the call has the 'Administer users' permission, accounts that are not yet active cannot be retrieved
- callers cannot retrieve e-mail addresses for anyone other  than themself, unless they have the 'Administer users' permission
- the anonymous user 0 cannot be retrieved

**Example Result**

```
{
  "uid":"123",
  "name":"bob",
  "mail":"bob@hotmail.com",
  "theme":"",
  "signature":"",
  "signature_format":"filtered_html",
  "created":"1355285904",
  "access":"1355285914",
  "login":"1355285937",
  "status":"1",
  "timezone":"America/New_York",
  "language":"",
  "picture":null,
  "data":false,
  "roles":{"2":"authenticated user"},
  /* ... */
}
```

 
## Update

**Example Result**

```
{
  "name":"bob",
  "uid":"123",
  "roles":{
    "2":"authenticated user"
  }
}
```

## Delete

`...`
