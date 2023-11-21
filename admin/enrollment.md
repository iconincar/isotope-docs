# Enrollment

After the base operating system has been installed, the computer must be enrolled via the Salt master server. Enrollment is the process of authorizing a device and then applying a configuration to it, including the deployment of any specific projects.

To perform these steps, you must have access to your Salt master server via `ssh`. If you do not have access, please contact your IT administrator for assistance.

After initial OS installation has completed, the computer will print a device ID on the screen. This is a unique identifier for the computer and you will need this ID to complete enrollment. All examples here will use the name `isotope-123456` as a placeholder. Replace this with the actual device ID of your computer. These instructions assume you are already logged into the Salt master server via `ssh`.

## Check for the Device ID

First, list all devices that are awaiting acceptance:

```bash
salt-key -l unaccepted
```

If you see your target device listed, skip to the next step, [Accepting the Device](#accepting-the-device).

If your device is not listed, here are a few things to check:

### Check network connectivity

Is the device connected to the network, and are there any firewalls blocking connectivity? Computers must be able to make outbound connections to the salt master server using TCP ports `4505`, `4506`, and `4507`'.

### Check for duplicate enrollments

If the device has previously been accepted--for example, if you have re-installed the base OS--then Salt may automatically deny the request to prevent unauthorized access. View the known device IDs in all categories:

`salt-key -A`

If the device ID is listed in the `Accepted` or `Rejected` categories, delete the device ID:

`salt-key -d isotope-123456`

Reboot the computer using the power button and then repeat this step to check whether the device ID is now listed in the `Unaccepted` category.

## Accept the Device

Run the following:

`salt-key -a isotope-123456`

## Ping the Device

This is a quick check to ensure that the device has been properly accepted and that it can communicate with the Salt master server.

`salt isotope-123456 test.ping`

If this command does not return `True`, then double-check the computer's network connectivity.

## Create a Configuration

A Pillar file containing the device configuration must be created at the path `pillar/minions/isotope-123456.sls`. This path is relative to the root of your Salt admin repository. In most cases, you can copy an existing Pillar file for another device and then customize it to suit your needs. The other pillar files may be found in the `pillar/minions` directory.

An example configuration with details on each of the available options can be found on the [System Configuration](./configuration) page.

## Apply the Configuration

Run the following:

`salt isotope-123456 state.apply`

This command may take several minutes to complete, while the computer downloads and installs all necessary packages to run isotope projects. It is always safe to run this command repeatedly, so if the process should fail due to interrupted connectivity or power outage, simply re-run this command once the issue has been resolved.

Upon successful completion, the system will be running a simple screensaver-style animation on each screen, or will be presenting some other project content if that project was pre-installed via the configuration.

Any time you make a change to the device's configuration, or to deploy updates to system software (including isotope itself) simply re-run this command.

## Reboot the Computer

It is a good idea to reboot the computer, to ensure that it is configured properly and that isotope is activated on boot.

`salt isotope-123456 system.reboot 0`
