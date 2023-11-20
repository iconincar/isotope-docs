# Installation

The instructions for booting from a USB drive may be slightly different depending on your computer manufacturer and whether or not any existing operating system exists on the computer. When in doubt, consult the user manual for your motherboard or computer.

::: warning
Depending on the installation options you choose, the existing data on the computer may be completely erased. If you have data that you wish to keep, it is strongly recommended to take a backup first and/or use a separate hard drive to install isotope. See below for installation options.
:::

## Booting the installation image

Insert the USB drive into any USB port the target computer.

When you power on a freshly-assembled computer with a blank hard drive, the installer may start automatically. Otherwise, you will need to hold down a key on the keyboard in order to access the boot menu. The key required to access the boot menu will vary from computer to computer, but is commonly one of the following: `F8`, `F10`, `F11`, `F12`. Refer to the user manual for your motherboard or PC to find the correct key to press. In all cases, hold down the appropriate key while powering on the computer and keep holding it until the boot menu appears. Alternatively, many computers allow selecting a boot device within the BIOS setup: this can commonly be accessed using the `F2` or `Del` keys.

At the boot menu, locate the first UEFI partition of the USB drive and select it. The boot menu will look different from computer to computer, and the name of the USB drive will differ depending on the manufacturer of the drive.

If the USB drive boots successfully, you will see a second menu with several available options. These options are described below.

## Installer Boot Options

Select the appropriate boot option for your circumstances.

### Manual Install (Advanced)

This option is highlighted by default as a safety measure, since the other two options will always erase all data. This option is suitable if you want to manually partition the drives on the computer and install isotope on a specific partition. This option is for advanced users who are comfortable with disk partitioning and wish to set up custom configurations such as dual boot. Beware that incorrect partitioning/formatting can erase all existing data on the computer.

Use this option when:
* You are comfortable with creating partition configurations.
* You want to create a non-standard configuration such as dual booting with another OS.

### Automatic Install

This is the most suitable option for a brand-new computer with no data on it, or with a default OS install that can be overwritten. This is the easiest option because it requires no user input. The hard drive will automatically be erased/formatted and isotope will be installed using the entire drive. Unless you have a specific reason to choose another installation option, this is the recommended choice. No GUI is presented.

Use this option when:
* You have Ethernet connectivity.
* The hard drive is blank or can be erased without data loss.

### Automatic Install (Graphical)

This is a mostly-automated option. This option works like "Automatic Install" except it provides a GUI for configuring network settings, if the computer is not already connected. All data on the computer will be erased.

Use this option when:
* You need to manually configure the network (e.g., to connect to a Wi-Fi access point).
* The hard drive is blank or can be erased without data loss.

## Wait for installation to complete

The installation will typically take between 5 and 15 minutes depending on the speed of your Internet connection. If the process seems to stall or takes significantly longer, please check the troubleshooting section below and/or shut down the computer and repeat the installation process. When initial installation is finished, the computer will reboot.

After the computer has rebooted, you will see a text prompt indicating that the initial installation is complete. You may now proceed to the enrollment step.

## Troubleshooting

The installation process is designed to be repeatable. If anything goes wrong, you may power off the computer at any time and repeat the installation process. If the computer does not shut down after pressing the power button, hold it down for at least 10 seconds to force a shutdown.

### The boot menu will not appear

* Double-check the user manual for your motherboard or PC to ensure that you are pressing the correct key. Make sure you keep the key held down until the boot menu appears.
* Some motherboards only iterate a certain number of USB devices on boot. If you have many USB devices connected (e.g., multiple touch  screens) try disconnecting all USB devices except the keyboard and the USB drive.
* Verify that the keyboard is connected by pressing Num Lock or Caps Lock and verifying that the appropriate light turns on or off.

### USB drive not shown in boot menu, or errors during boot

* Try disabling Secure Boot in your computer's BIOS settings.
* Re-write the USB image using the instructions above.

### The installer appears to hang, or never completes

* Verify your network setup against the requirements above, and if necessary, use the graphical installer option to manually configure the network.
* Power off the computer and repeat the installation instructions.
