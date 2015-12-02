## Introduction

This document describes how to develop for DrupalGap core (or hack it to do what you want). It is intended for an intermediate/advanced audience.

## Getting Ready

Before continuing onward with this guide, we highly recommend [forking DrupalGap on GitHub.com](https://github.com/signalpoint/DrupalGap/fork).

This will allow you to easily "pull" in new code from DrupalGap core as it is improved, and will allow you to "push" new code to DrupalGap core to make it better for everyone.

Instead of **hacking** core, the DrupalGap team would love to hear why it needs to be done. There may be a way to do it without changing the core code, or if it is necessary, it would be wonderful to share your code changes to benefit everyone. Of course there are times when pleasing everyone isn't possible, so feel free to hack away ;)

## Compiling the drupalgap.js file

```
bin/drupalgap.js
bin/drupalgap.min.js
```

This file contains thousands of lines of code, and obviously would be a nightmare to maintain. That's why we use a makefile to take all of the DrupalGap source code, which is spread across many directories and files, and compile them all down into a single JavaScript file for better performance.

The actual source code for DrupalGap core is located here:

`src/*`

After making any modifications to DrupalGap core in the `src` directory, the `bin/drupalgap.js` file needs to be rebuilt using the makefile. Navigate to your app's www directory and then run the makefile:

```
cd www
make
```

This will compile all of the source code into the single JavaScript file, located here:

`bin/drupalgap.js`

If there are any problems during the make, the error messages will be output to the terminal window.

Now that we have the single JavaScript file, this is what will be included in the `index.html` file for our app:

`<script type="bin/drupalgap.js"></script>`

Now we're ready to begin developing inside DrupalGap core.

## Pulling Latest Changes

After you've made a fork of DrupalGap, chances are you'll eventually need to pull the latest changes into your fork. It can be done with these terminal commands:

```
git remote -v
git remote add upstream https://github.com/signalpoint/DrupalGap.git
git remote -v
git fetch upstream
git merge upstream/7.x-1.x
git log
```

See these two pages for more details:

- [https://help.github.com/articles/configuring-a-remote-for-a-fork](https://help.github.com/articles/configuring-a-remote-for-a-fork)
- [https://help.github.com/articles/syncing-a-fork](https://help.github.com/articles/syncing-a-fork)