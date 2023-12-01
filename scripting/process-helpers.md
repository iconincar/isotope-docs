# Process Helpers

Certain types of programs are commonly used with isotope, so some helper functions have been created to more easily launch those types of programs. These helpers apply the necessary launch options to make those programs work well with the compositor. These helper functions provide a more user-friendly interface so that script authors can ignore some of the technical details.

These functions are intended to be used in the [`processes` field of a profile object](./profile#field-processes). Examples are included below. The functions described here are global.

## Web View

| Signature | `webview(url)` |
| - | - |
| url (string) | A valid web URL. |
| Returns | (table) process launch options |

A customized web browser is included, allowing for easy presentation of any web content. The web view will be launched with transparency enabled.

::: tip Example: Profile that shows a web site
```lua
{
    name = "My Project",
    processes = {
        example = webview("https://example.org")
    }

    -- other profile fields and functions
}
```
This profile launches a browser that will load and display a web site. The process will have the name `example`.
:::

::: tip Example: Profile that shows local HTML content
```lua
{
    name = "My Project",
    processes = {
        example = webview("file:///srv/projects/MyProject/index.html")
    }

    -- other profile fields and functions
}
```
This profile launches a browser that will load and display HTML from a local file. The process will have the name `example`.
:::

## Unity

| Signature | `unity(path, options)` |
| - | - |
| path (string) | The path to the packaged Unity project executable. |
| options (table or nil) | Extra options that can be applied (see below). |

| Option | Default | Description |
| - | - | - |
| transparent | false | When true, the environment is configured to support window transparency. |
| force_vsync | false | When true, force the Unity program to synchronize to VBlank, regardless of project settings. |
| x11 | false | When true, run Unity in X11-compatibility mode instead of Wayland. |

Creates launch options for a typical Unity-based program. The Unity executable is usually a file with a name that looks like `MyProject.x86_64` inside the packaged build directory.

::: tip Example: Profile that shows a web site
```lua
{
    name = "My Project",
    processes = {
        example = unity("/srv/projects/MyProject/MyProject.x86_64", {
            transparent = true
        })
    }

    -- other profile fields and functions
}
```
This profile launches a Unity program with the process name `example` and transparency enabled.
:::

## Unreal Engine

| Signature | `unreal(path, options)` |
| - | - |
| path (string) | The path to the packaged Unreal Engine wrapper script. |
| options (table or nil) | Extra options that can be applied (see below). |

| Option | Default | Description |
| - | - | - |
| transparent | false | When true, the environment is configured to support window transparency. |

Creates launch options for a typical Unreal Engine-based program. The wrapper shell script is usually located at the root of the packaged/compiled project with a name like `MyProject.sh`.

::: tip Example: Profile that shows a web site
```lua
{
    name = "My Project",
    processes = {
        example = unreal("/srv/projects/MyProject/MyProject.sh")
    }

    -- other profile fields and functions
}
```
This profile launches an Unreal Engine program with the process name `example`.
:::

## ProtoPie

This function is available only when ProtoPie Connect is installed on the computer.

| Signature | `protopie(pie_name)` |
| - | - |
| pie_name (string) | The name of the pie. |

This will launch a web view connected to a ProtoPie prototype hosed by the local ProtoPie Connect instance. The `.pie` file must first be uploaded to the ProtoPie Connect UI. Window transparency is enabled.

::: tip Example: Profile that shows a web site
```lua
{
    name = "My Project",
    processes = {
        example = protopie("MyProject")
    }

    -- other profile fields and functions
}
```
This profile launches a ProtoPie prototype called `MyProject` that was previously uploaded to the ProtoPie Connect UI.
:::
