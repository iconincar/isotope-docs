# Basic Concepts

isotope is a customized operating system and compositor designed specifically for many non-desktop computing scenarios such as: automotive UI prototyping in seating bucks or show cars, digital signage, kiosks, and other single- or multi-display interactive experiences. isotope especially excels at complex multi-display touch configurations with a combination of different content types, but also offers a lot of control even over simple single-display deployments.

The core design goals of isotope are flexibility and control. Profiles can range from very simple to very complex. As a profile author, you can control every pixel that gets displayed on your various screens, and also configure many unusual combinations of application content that may be difficult or impossible in other environments. In essence, the isotope compositor completely replaces a standard desktop environment with a layout controlled entirely by your profile scripts.

In other words, you can create content in any number of different applications and host them on isotope in a variety of configurations, controlled by your scripts. Any logic you define can be dynamic, meaning that it can respond to the number of connected screens as well as numerous other variables. As a simple example of this flexibility, you could display a number of applications on a number of different screens when running in a multi-display configuration, and display that same content together on one large high-resolution display for preview and prototyping. 

Features unique to isotope include the following:

* Create layouts for screens and applications using scripting logic at any level of complexity.
* Stack multiple applications together with full support for alpha-blended transparency.
* Control which applications receive user input and when.
* Communicate between applications to synchronize state.
* Prevent unwanted OS pop-ups, updates, etc.
* Prevent users from "escaping" applications by exercising total control over touch, keyboard, and mouse inputs.
  
isotope offers this control via the Lua scripting language combined with a streamlined API. This can be achieved with little or no modification to your applications, allowing content authors to independently create content in whatever tools they know best. Almost any application that can run in a Linux environment can be used with isotope. As far as these applications are concerned, they are running on a standard desktop PC.

The [scripting guide](/scripting/) provides a [glossary of terms](/scripting/glossary) that will be useful for project authors as they read this documentation.
