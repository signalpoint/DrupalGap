This directory is used by the makefile_full to generate the drupalgap.js file
from the src directory. To get the tools needed to run that makefile, type this
terminal command from your mobile app's root directory:

`sudo make -B tools`

That command will grab all the tools necessary to run the makefile. To build
the drupalgap.js bin file, use this terminal command from your mobile app's
root directory:

`make`

What this does, is it follows the syntax in the makefile, and generates one
single drupalgap.js file in the bin directory, from all of the code in the src
directory.

Anytime changes are made to DrupalGap core in the src directory, the make
command must be run again to assemble the drupalgap.js file in the bin
directory.

