# Web Console

From a users perspective the web console is the main interface to manipulate an Isotope machine. In this interface you can change the `Profile`, change the `Layout` or do some basic configuration work.

### Access

Every Isotope machine has it's own web console. You can access it via a special URL in the browser from the local network or through the web, if it was setup in that way. To access it via the web it may be necessary to connect to a VPN network. 

### Changing Profiles

Profiles can be changed in the top right corner. When you click on the name of the current Profile, a popup will be opened and you can select a different Profile. Profiles represent a complete configuration for a project, therefore one Profile usually corresponds to one project. It contains a definition of the applications that should be run and how they should be distributed over the screens. One Profile can also contain multiple Layout definitions for different screen configurations at seperate Isotope machines.

### Changing Layouts

Layouts can be changed in the top right corner. When you click on the name of the current Layout, a popup will be opened and you can select a different Layout. Layouts represent a screen setup and change how the content is distributed over the screens. This is mainly used if there are multiple configurations with different amounts of screens or different configurations.

### Reloading the current layout

With the reload icon in the top right corner the currently selected Layout can be reloaded. 

## Pages

In the top left the different pages of the web console can be selected. 

### Status Page

In the middle of the status page you can see information about the Isotope machine, like:
    <ul>
    <li>The `Displays` that are handled by Isotope (can be physically connected displays or virtual displays [virt])</li>
    <li>A simple representation of the `Layout` and the current display distribution (if you click on the little camera icon a screenshot of the current content on all screens will be made and downloaded)</li>
    <li>The `Processes` that are currently running in this profile (if you click on the trashcan icon Isotope will restart all processes)</li>
    <li>The current ` System Temperatures` of the Isotope machine</li>
    </ul>

### Setup Page

On the setup page you can change some basic configuration settigs, like:
    <ul>
    <li>Switching the `Profile`</li>
    <li>Switching the `Layout`</li>
    <li>Running the `Touch Setup` (this should always be run if you experience any issues with the touch or if the connected displays were changed in any way)</li>
    <li>Configuring the `Audio Settings` (Change the audio output and the volume)</li>
    <li>Configuring the `Display Settings` (Adjust color temperature and brightness for each physically connected display)</li>
    </ul>

### Tools Page

On the tools page you have access to different services that come with Isotope:
    <ul>
    <li>The `Remote Viewer` let's you see and interact with the content, that is currently displayed on all connected and virtual displays</li>
    <li>With `ProtoPie Connect` you can manage the available ProtoPie files, look at them individualy and view the messages that are sent between them</li>
    <li>The `Cockpit` gives you access to more details about the OS. Manage users, services, the firewall and other settings including a terminal window of the Isotope machine</li>
    </ul>

### Logs Page

On the logs page you can see the system log of the Linux OS. This includes all of the logs that Unity, Unreal or any other service is outputting. 

### Remote Viewer (Tools page)

The remote viewer let's you see the current output for all displays and manipulate them. This makes it a great tool if you don't have direct acess to the Isotope machine.<br>

You can select which display you want to look at in the top left. These can either be physically connected displays or virtual displays.

In the top right you can activate different settings:
    <ul>
    <li>The `Mouse Cursor` let's you interact with the content on the screens. It simulates a mouse cursor so you can click on UI elements</li>
    <li>The `Sound Icon` activates the sound output of the Isotope machine through the browser</li>
    <li>The `Magnifying Glass` zooms in to 100% on a display</li>
    <li>The `Bordered Square` activates fullscreen mode</li>
    </ul>