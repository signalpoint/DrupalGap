# DrupalGap CLI - Command Line Interface

To help automate application development, DrupalGap comes with a command line
interface (more commonly referred to as a CLI). With the DrupalGap CLI we can
quickly take care of typical development and maintenance tasks.

## Setup

To utilize the DrupalGap CLI, use your terminal window to make the `drupalgap`
bash script executable:

```
cd mobile-application
chmod +x drupalgap.sh
```

## Usage

To use the DrupalGap CLI, open a terminal window and navigate to your mobile
app's directory:

```
cd mobile-application
./drupalgap.sh
```

### Download

Use the download command to quickly grab a DrupalGap module or theme:

```
./drupalgap.sh dl telephone
```

### Update

To update the DrupalGap SDK binary files, run this command:

```
./drupalgap up
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
./drupalgap.sh module create my_module
```

## Troubleshooting

Without adding the executable permission mentioned above in the *Setup*, you'll
most likely get this error:

```
bash: ./drupalgap.sh: Permission denied
```
