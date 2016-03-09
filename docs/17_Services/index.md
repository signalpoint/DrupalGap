DrupalGap utilizes [jDrupal](https://github.com/easystreet3/jDrupal) to communicate with the [Services](https://drupal.org/project/services) module on a Drupal website.

## How does the Services module work?

The Services module provides URLs that can be used by a mobile application to C.R.U.D. entities on a Drupal website.

**C.R.U.D** (create, retrieve, update, delete)

- Nodes
- Users (*login, logout, registration, sessions*)
- Comments
- Files
- Taxonomy

## How does DrupalGap use the Services module?

DrupalGap uses the Services module to C.R.U.D. entities and manage user authentication with Drupal.
Example Service Calls

### Retrieve a Node (HTTP GET)

See `node_load()` to automatically load a node, this example is for illustration purposes.

`http://example.com/drupalgap/node/123.json`

```
{
  nid: 123,
  title: "Hello World",
  uid: 1,
  type: "article"
}
```

Note, in this example our Service endpoint name is `drupalgap` and it shows just a small sample of the JSON data returned for a node.

### Register a User (HTTP POST)

The user registration form is pre-built into DrupalGap, this example is for illustration purposes. See `user_register()` for more details.

`http://example.com/drupalgap/user/register.json?name=bob&mail=bob@bob.com`

```
{
  uid:456,
  uri:"http://www.example.com/drupalgap/user/456.json"
}
```

Note, the mail value would need to be ***URL encoded** as `bob%40bob.com` before being posted.