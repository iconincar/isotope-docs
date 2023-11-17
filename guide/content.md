# Content

The vast majority of the content presented on an isotope computer will come in the form of some external program such as a web view, a compiled application using a game engine, or programs using other UI toolkits. In general, any program or engine that supports Wayland or X11 may be used with isotope. This page covers some of the things you may need to know to use common types of programs with isotope.

## Web Pages and Web Apps

Support for web content is built into isotope in the form of a customized browser (or "web view") based on the ubiquitous Chromium engine. Web views support all modern web-based technologies such as media, WebGL and WebRTC.

The easiest way to integrate web content into your project is to use the [`webview` helper function](../scripting/process-helpers#web-view) when defining [`processes` in your profile script](../scripting/profile#field-processes).

Web views can be used as a transparent overlay with other content underneath. When using transparent web content, make sure that you do not have an opaque background in your CSS styles.

::: tip Example: A transparent web page
```html
<html>
    <head>
        <style>
            html, body {
                background: transparent;
                color: white;
            }
        </style>
    <body>
        <h1>Hello, World!</h1>
    </body>
</html>
```
:::

## Unity

Unity developers should make note of the following suggestions:

* Projects should be built to target Linux (x86-64). You may need to install the Linux build target using the Unity Hub installer.
* Under Player Settings / Resolution and Presentation / Resolution, select Fullscreen Mode = Windowed.
* Under Player Settings / Resolution and Presentation / Standalone Player Options, make sure Resizable Window is checked. This will prevent Unity from fighting the window manager when it tries to place its window according to your project's configuration.

The easiest way to use compiled Unity programs in your project is to use the [`unity` helper function](../scripting/process-helpers#unity) when defining [`processes` in your profile script](../scripting/profile#field-processes).

When using the built-in Unity renderer, transparency is supported to allow a Unity program to act as an overlay or to be combined with content from other programs. When using a transparent window, ensure that your main rendering camera is configured to use a solid clear color with zero opacity.

## ProtoPie

When ProtoPie Connect is installed on an isotope computer, ProtoPie prototypes can be installed using the standard ProtoPie Connect web UI. Any uploaded `.pie` may be used with as isotope content.

The easiest way to use ProtoPie prototypes in your project is to use the [`protopie` helper function](../scripting/process-helpers#protopie) when defining [`processes` in your profile script](../scripting/profile#field-processes).

Transparency is supported to allow ProtoPie prototypes to act as overlays on top of other content. To enable transparency, ensure that your prototype has a background 

## Unreal Engine

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
