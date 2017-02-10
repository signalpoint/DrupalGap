## Build the Routes

To build routes that utilize a local task menu bar, try something like this:

```
routes["example.group"] = {
  "path": "/group\/(.*)",
  "defaults": {
    "_title": "Group",
    _controller: example.groupController
  }
};
routes["example.group-members"] = {
  "path": "/group-members\/(.*)",
  "defaults": {
    "_title": "Members",
    _controller: example.groupMembersController,
    _base_route: 'example.group'
  }
};
routes["example.group-events"] = {
  "path": "/group-events\/(.*)",
  "defaults": {
    "_title": "Events",
    _controller: example.groupEventsController,
    _dgEntityType: 'node',
    _dgController: example.pageGroupEvents,
    _base_route: 'example.group'
  }
};
```

## Displaying the Block

Then to display the local task menu bar, you would typically add the `primary_local_tasks` block to the `content` region of your theme's configuration in the `settings.js` file:

```
// DrupalGap's primary local tasks.
primary_local_tasks: { },
```
