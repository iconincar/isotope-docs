# Using Unity Content

Unity developers should make note of the following suggestions:

* Projects should be built to target Linux (x86-64). You may need to install the Linux build target using the Unity Hub installer.
* Under `Player Settings` / `Resolution and Presentation` / `Resolution`, select `Fullscreen Mode` = `Fullscreen Window` or `Windowed`.
* Under `Player Settings` / `Resolution and Presentation` / `Standalone Player Options`, make sure `Resizable Window` is checked. This will prevent Unity from fighting the window manager when it tries to place its window according to your project's configuration.

The easiest way to use compiled Unity programs in your project is to use the [`unity` helper function](../scripting/process-helpers#unity) when defining [`processes` in your profile script](../scripting/profile#field-processes).

## Logging

When launched with the [process helper](/scripting/process-helpers#unity) any log output that your program emits using the [`Debug.Log` method](https://docs.unity3d.com/ScriptReference/Debug.Log.html) and similar methods will be captured in the system logs and will be viewable in the web console.

## V-Sync

It is generally recommended to configure your project to synchronize to VBlank using the Project Settings / Quality / VSync Count setting. When this option is set to "Don't Sync" it can result in excessive CPU and GPU usage as Unity renders frames that will never be displayed. By default, newly created projects have this option set appropriately.

::: warning
When using Unity's OpenGL renderer with some types of drivers, the project's "VSync Count" setting will not be properly applied and Unity will still render frames as quickly as possible. If you notice excessive CPU or GPU usage when using the OpenGL renderer, it is recommended to use the [`force_vsync` option](/scripting/process-helpers#unity) in your profile script.

Unity's Vulkan renderer is not affected by this issue.
:::

## Transparency

When using the built-in Unity renderer, transparency is supported to allow a Unity program to act as an overlay or to be combined with content from other programs. When using a transparent window, ensure that your main rendering camera is configured to use a solid clear color with zero opacity.

When attempting to use transparency with a scriptable rendering pipeline, the pipeline must be configured or modified to write proper alpha channel values to the rendering surface.

## Multiple Displays

Unity has built-in support for up to 8 full-screen windows [as described here](https://docs.unity3d.com/Manual/MultiDisplay.html). However, since output and view layouts are entirely under the control of the compositor, Unity is merely able to suggest a preferred display. It is up to your script to decide whether or not to honor the request by inspecting the result of the [`preferred_output` method](/scripting/surface#method-preferred-output) for each surface.

Unity refers to displays by index (with zero being the "primary" display) while isotope refers to outputs by connector name and has no concept of a primary output. Unfortunately, Unity currently provides no way to retrieve the name of each display. This can make it difficult to predict which physical display corresponds to which display index in Unity. This shortcoming is especially noticeable when outputs are added or removed on the fly: the index of a particular physical display may change. Worse, Unity queries display information once on startup and does not refresh this information when displays are added or removed.

Finally, if the display that Unity considers the "primary" display is removed, then the Unity program will stop running (and may be re-launched by isotope with a new primary display). This can occur even if the compositor is not displaying the Unity content on that display. If you need to work around this particular problem, you may try launching Unity [with the X11 flag](/scripting/process-helpers#unity).

::: warning
When using Unity's multi-display feature with V-Sync enabled, all Unity windows must be visible somewhere in your layout or Unity will pause rendering for all windows. This is a limitation of the single-threaded nature of Unity's multi-window support. A window that is not shown on any output has no display on which to synchronize, affecting all windows.
:::

It is important to keep these limitations in mind when designing Unity programs that make use of multiple displays, and avoid adding or removing displays while your project is running. The display indexes will remain stable between reboots provided they are all active on startup.

One possible workaround is to combine multiple displays into one by configuring your scene to render multiple cameras into a single viewport (a.k.a, a "split screen" mode) and then use [viewportals](/scripting/surface#method-add-view) to consistently position the individual regions on separate outputs.
