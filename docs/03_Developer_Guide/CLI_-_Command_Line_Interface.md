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

### Download

Use the download command to quickly grab a DrupalGap module or theme:

```
./dg dl telephone
```

### Update

To update the DrupalGap SDK binary files, run this command:

```
./dg up
```

Backups will be saved in a directory called `.drupalgap-backups` if you need
to roll back:

```
cd .drupalgap-backups
ls -la
```

### Create

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
