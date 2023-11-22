# Cockpit

When enabled via [system configuration](./configuration#system-section), isotope computers provide a web-based system administration UI called [Cockpit](https://cockpit-project.org/). For detailed information on the different functions of Cockpit, see [the usage guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/managing_systems_using_the_rhel_9_web_console/index).

Cockpit may be accessed locally on computers with a display and keyboard/mouse plugged in [when enabled](./configuration#isotope-section), or it may be accessed via a web browser when enabled with [reverse proxy](./configuration#proxy). Cockpit requires logging in with a password using the [admin account](./configuration#admin).

## Access With Web Browser

Use a web browser to access the [web console](/user/web-console) and click on the `TOOLS` tab. If Cockpit is enabled, the `Open Cockpit` button will send you to the Cockpit interface. Alternatively, you may access Cockpit directly via the URL `http://isotope-123456.local/admin`, replacing `isotope-123456` with the actual device ID of the isotope computer.

## Access Locally

Use the global hotkey `Ctrl-Alt-F3` to switch isotope into a built-in Cockpit profile mode. This profile loads and displays the Cockpit UI on a single screen using a web view. You may then interact with the Cockpit UI using a keyboard and mouse (or touch) as usual. This mode of operation is convenient when the computer has no network connectivity.

When using multiple displays, Cockpit may not open by default on a display that is convenient, or it might have the wrong orientation. With the Cockpit UI active, the following hotkeys may be used:

| Key Combo | Function |
| - | - |
| `Ctrl-Alt-RightArrow` | Move the Cockpit UI to the next screen. |
| `Ctrl-Alt-LeftArrow` | Move the Cockpit UI to the previous screen. |
| `Ctrl-Alt-UpArrow` | Rotate the Cockpit UI by 90 degrees clockwise. |
| `Ctrl-Alt-DownArrow` | Rotate the Cockpit UI by 90 degrees counter-clockwise. |
