# Writing Install Media

The ISO image file must be written directly to the USB drive as a raw disk image. Simply copying the image to a formatted USB drive will not work. Each of these methods require administrator access (member of the Administrators group on Windows, or `sudo` access on Mac and Linux). If you do not have administrator access on your workstation, you will need to contact your IT department for assistance.

**WARNING!**

**When following the instructions below, take extra care to ensure that you are writing to the correct drive. This process will overwrite the contents of the selected drive.**

### Windows

Writing a raw ISO image on Windows requires the use of a third-party tool. The Rufus tool [available here](https://rufus.ie/en/) is known to work.

Click the `SELECT` button and choose the `.iso` file being written. After selecting the `.iso` image file, you may leave all other settings at their defaults. Click `Start`.

**IMPORTANT:** After you click `Start`, a dialog box will appear asking which write mode to use. Be sure to select `Write in DD image mode`. Using the default ISO image mode may create an image that does not boot properly.

### Mac

The following commands require the use of a terminal window. Open the terminal app on your Mac.

Get a list of connected drives and identify your USB drive: `diskutil list`

For the sake of these instructions, we'll reference the device `/dev/diskX`. Replace this with the actual device path in the following commands.

Mac OS may auto-mount partitions on the disk. To ensure that no partitions are mounted, run a command like this for each listed partition: `sudo umount /dev/diskXsY` replacing X with the disk number and Y with each partition number.

Write the image to the drive using a command like this (take note of the lowercase `r` just after `/dev/`, which indicates your intent to write to the raw drive): `sudo dd if=isotope-install.iso of=/dev/rdiskX bs=1m`

When the command completes, eject the drive: `diskutil eject /dev/diskX`

You may now remove the USB drive.

### Linux

Insert the USB drive and use the `lsblk` command to inspect all connected storage devices. Identify the USB drive. For the sake of these instructions, we'll reference the device `/dev/sdX`. Replace this with the actual device path in the following commands.

If the `lsblk` command indicates that the USB drive has been auto-mounted (if the `MOUNTPOINTS` column is not blank), then unmount any mounted partitions. For example: `sudo umount /dev/sdX1`.

Copy the image onto the USB drive: `sudo cp isotope-install.iso /dev/sdX`

Wait until the command has fully completed before removing the USB drive.

