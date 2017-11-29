# DrupalGap CLI - Command Line Interface

To help automate application development, DrupalGap comes with a command line
interface (more commonly referred to as a CLI). With the DrupalGap CLI we can
quickly take care of typical development and maintenance tasks.

## Setup

To utilize the DrupalGap CLI, use your terminal window to make the `drupalgap`
bash script executable:

```
cd app
chmod +x dg
```

## Usage

To use the DrupalGap CLI, open a terminal window and navigate to your mobile
app's directory:

```
cd app
./dg
```

If you get a message saying the CLI is ready, then you are good to go. Try some of the commands below:

### Download

Download a module:

```
./dg dl dg_autocomplete
```

### Enable

Enable a module:

```
./dg en dg_autocomplete
```

### Disable

Disable a module:

```
./dg dis dg_autocomplete
```

### Update

The DrupalGap CLI has the `update` command to help with updating the SDK, jDrupal and contributed modules.

Backups will be saved in a directory called `drupalgap-backups` within your home directory if you need to roll back:

```
cd .drupalgap-backups
ls -la
```

#### Update DrupalGap

To update the `drupalgap.min.js` file, run this command:

```
./dg up
```

#### Update jDrupal

To update the `jdrupal.min.js` file, run this command:

```
./dg up jdrupal
```

#### Update a Module

To update an individual module, try this:

```
./dg up dg_autocomplete
```

### Create Module

Use the create command to quickly create a custom module:

```
./dg create module my_module
```

## Troubleshooting

> bash: ./dg: Permission denied 

Without adding the executable permission mentioned in the *CLI Setup*, you'll
most likely get a permission denied.

> dg: command not found

You forgot to place the `./` in front of your command, for example: `./dg up`
