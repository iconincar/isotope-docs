# Touch Setup

This is an important step when setting up a computer with multiple displays where one or more of those displays are touch-enabled. This step is required because touch screens are almost always two devices in one: the display itself and the touch input device. While these two devices may be in the same enclosure, they are connected separately to the computer via a combination of USB cable and some display cable such as DisplayPort or HDMI.

The touch setup procedure can be skipped when any of the following are true:

* The setup has no touch screens.
* The setup only has a single screen, even if it supports touch.

In all other situations, touch interactions will not be properly handled until touch setup is complete.

1. Ensure all displays are connected to the GPU, and that all touch screens are also connected via USB.
2. Access the isotope web console via browser. See [Finding the Computer](./finding-the-computer).
3. Navigate to the `SETUP` tab.
4. Click the `Touch Setup` button.
5. As each touch screen lights up, tap it once. The highlight will move to the next screen. If you have displays that are not touch-enabled, you may press the `Skip` button in the web browser to skip to the next display.

If there were any problems during the touch setup procedure, it is safe to repeat the procedure until it has been completed successfully. Once complete, the configuration will be saved.

::: warning
Any of the following actions will invalidate the touch configuration. Please run the configuration again to maintain full touch functionality.
* Adding new touch screens.
* Changing the USB port to which any touch screen is connected (including different ports on the same USB hub).
* Changing the GPU port to which any touch display is connected.

In short, it is best to re-run the touch setup procedure whenever cabling has been modified.
:::
