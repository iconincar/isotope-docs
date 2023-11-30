# Using Unreal Engine Content

Unreal Engine developers should make note of the following suggestions.

* Use Unreal Engine 5.2 or newer.
* Under Project Settings / Project / Description / Settings, make sure "Allow Window Resize" is checked and "Should Window Preserve Aspect Ratio" is UN-checked so that the engine does not fight the window manager when it tries to place its window according to your project's configuration.
* Set the DPI curve to be totally flat. Otherwise, on setups with many screens, Unreal will think it's running on a very high-density display and scale UI elements incorrectly. This setting is under Project Settings / Engine / User Interface / DPI Scaling / DPI Curve. Delete the extra control points so that the curve is flat at 1.
* It is recommended to limit the frame rate in order to avoid generating unnecessary heat (Unreal can be very heavy). Either apply frame rate smoothing or a fixed frame rate under Project Settings / Engine / General Settings / Framerate.
* The "Use Mouse for Touch" flag (or bUseMouseForTouch in Input.ini) is known to cause issues with Slate widgets when only touch screens are connected. It is recommended to set this flag to false in production deployments. It's possible to use a platform-specific INI file to disable it only on Linux.

Unreal Engine projects should be compiled and packaged to target Linux (x64). There are several patches available for Unreal. These address issues with Unreal running under isotope in certain corner cases. If you are having trouble with window sizes or touch input, these patches may be applicable to you. They need only be applied on the build server or any machine actually packaging projects for isotope.

To use an Unreal program as a transparent overlay, there are a few requirements:

* In your project settings, under Engine / Rendering, make sure "Enable alpha channel support in post processing" is set to "Allow through tonemapper."
* You must apply a post-processing material that writes expected values to the alpha channel.
