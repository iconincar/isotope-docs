# Object: profile

Unlike most of the other object types which are created by and retrieved from the compositor itself, the profile object is defined by the author of a profile script. It contains a mix of fields and methods, some of which are accessed and used by the compositor. A profile object defines the behavior of a particular profile or project, including which processes should be running, how outputs and views are arranged, and any other custom behaviors a project requires.

## Registering profiles

This global `profile` function is used to register a profile, and is the main entry-point for almost all scripts:

```lua
profile(profile_object)
```

It takes a single argument in the form of a Lua table containing the profile definition, including any functions or fields that the profile defines.

::: tip Example: Calling `profile` with minimum possible profile
```lua
profile {
    name = "myproject",
    title = "My Project"
}
```
Note that the function call parentheses are omitted here by convention, to make a profile script look more like a configuration file. In Lua, parentheses are optional when calling a function that takes a single table argument.
:::

## Fields

### name

| Field | `name` |
| - | - |
| Type | string |
| Required | Yes |

A unique identifier for the profile being defined. This string is used internally by the compositor, and may also be used by external tools, but it is not shown to the user.

### title

| Field | `title` |
| - | - |
| Type | string |
| Required | Yes |

A user-friendly display name for the profile, shown in UIs such as the web console.

### processes

| Field | `processes` |
| - | - |
| Type | table |
| Default | An empty table: no processes. |

A table of named process definitions, indicating which programs should be started when this profile is activated. This field will be ignored if the `refresh_processes` method is defined. Each named process is assigned a process definition, which is simply a list of arguments as follows:

| Argument | Value | Type | Default |
| - | - | - | - |
| 1 | Executable path | string | N/A (required) |
| 2 | Executable arguments | list of strings | empty list |
| 3 | Environment variables | list of strings in the format VARIABLE=VALUE | empty list |
| 4 | Special flags | table of key/boolean pairs | empty list |

::: tip Example: A basic profile that launches a single process
```lua
profile {
    name = "myproject",
    title = "My Project",
    processes = {
        welcome = { "/usr/bin/isotope-welcome" }
    }
}
```
:::

::: tip Example: Two processes, one with extra options
```lua
profile {
    name = "myproject",
    title = "My Project",
    processes = {
        myprogram1 = {
            "/path/to/my/program1",
            { "--arg", "--arg2" },
            { "MY_ENV_VAR=SOME_VALUE" }
        },
        myprogram2 = {
            "/path/to/my/program2"
        }
    }
}
```
This example launches two programs, the first of which is passed some command-line arguments and a custom environment variable. Note that each program has a unique name. This name may be referenced in profile methods to help determine how each program's views should be handled.
:::

### Custom fields

Other fields may be defined as required by your profile. This allows profiles to maintain an internal state where needed. The fields may use any legal identifier in Lua so long as they do not clash with other fields used by the compositor. Custom fields may be of any Lua type, including tables and functions. Custom fields may be accessed using the `self` argument that is passed in to all profile methods.

::: tip Example: Defining a custom field and using it in a function
```lua
profile {
    name = "myproject",
    title = "My Project",

    my_custom_field = 42,

    start = function(self)
        log.info("My custom field is: " .. self.my_custom_field);
    end
}
```
:::

The following methods may optionally be defined on a profile object. When an optional method is not defined, a basic default behavior is implemented as noted for each method. For all of these methods, the profile object itself is passed as the `self` parameter, allowing the function implementation to access profile fields.

## Methods

You can think of profile methods as user-defined callback functions that are invoked whenever certain events occur. The first argument (`self`) of each of these functions will always contain the profile object itself.

### compute_layouts

| Method | `compute_layouts(self)` |
| - | - |
| self | The profile object |
| Returns | Nothing |

This method is called whenever the compositor needs to know the set of available layouts that a profile supports. Since the set of supported layouts may depend on which output(s) are connected, this method is called each time an output is added or removed. An implementation should call the `server:register_layout()` method for each supported layout, after optionally inspecting the connected outputs or other system information.

If this method is not defined, a default implementation registers a single layout with a name of `default` and a title of `Default`. Registering custom layouts is an optional feature that may be skipped by any profiles that do not require that functionality. A common use for multiple layouts is to define configurations that can be used with multiple physical setups differ from each other, or to create multiple operational modes in which content can be displayed differently.

::: tip Example: A simple default implementation
```lua
profile {
    -- <other profile fields here>

    compute_layouts = function(self)
        server:register_layout("default", "Default");
    end
}
```
:::

::: tip Example: A slightly more complex implementation that inspects the number of outputs
```lua
profile {
    -- <other profile fields here>

    compute_layouts = function(self)
        local num_outputs = #server:outputs();
        if num_outputs > 1 then
            server:register_layout("clone", "Cloned Displays");
            server:register_layout("panorama", "Panoramic Displays");
        else
            server:register_layout("single", "Single Display");
        end
    end
}
```
:::

Layout names have no special meaning to the compositor. Registered layouts are simply presented in UIs such as the web console, allowing users to select from the available layouts without the need to build a custom UI. In this way, layouts allow for the definition of multiple sets of behaviors in a single profile. The currently-selected (or active) layout may be used by other profile functions such as `arrange_outputs()` in order to select the appropriate logic for that layout.

This method is called when:
* The profile is activated or reloaded.
* An output is connected or disconnected.

### arrange_outputs

| Method | `arrange_outputs(self)` |
| - | - |
| self | The profile object |
| Returns | Nothing |

This method is responsible for arranging connected outputs in logical layout space. The position, scale, and rotation of each output is decided here, using whatever combination of factors is required. An implementation may take into account the currently active layout (as defined in `compute_layouts` and selected by the user), the number of connected outputs and their resolutions, and other factors as desired.

When not implemented by a profile, the default implementation will simply place all outputs at the same location in the layout, with no scaling or rotation applied--effectively cloning the displays if they are the same resolution. The default behavior is suitable mainly for physical setups that have only a single display, such as a basic kiosk.

::: tip Example: Simple default duplication of all outputs with no scaling
In this configuration, all outputs will be placed with their upper-left corner at `0,0` in logical layout space. Assuming all outputs are the same resolution, the content on each will be identical, cloning the displays.
```lua
profile {
    -- <other profile fields here>

    arrange_outputs = function(self)
        for _, output in ipairs(server:outputs()) do
            output:place(0, 0);
        end
    end
}
```
:::

::: tip Example: Simple conditional output layout (single vs. cloned vs. panoramic)
This illustrates using the active layout to modify the output configuration. Of special note, when the `single` layout is active, the implementation removes all outputs except the first one from the layout.

A real implementation might take into account the names of the outputs to ensure that they are placed in the desired order, and could also scale the outputs so that content lines up regardless of resolution differences.
```lua
profile {
    -- <other profile fields here>

    compute_layouts = function(self) do
        if #server:outputs() > 1 then
            server:register_layout("clone", "Cloned Displays");
            server:register_layout("panorama", "Panoramic Displays");
        else
            server:register_layout("single", "Single Display");
        end
    end,

    arrange_outputs = function(self)
        local layout = server:active_layout();

        if layout == "panorama" then
            local x = 0;
            for _, output in ipairs(server:outputs()) do
                output:place(x, 0); -- Note the differing x coordinate here.
                local width, height = output:size();
                x = x + width;
            end
        elseif layout == "clone" then
            for _, output in ipairs(server:outputs()) do
                output:place(0, 0);
            end
        elseif layout == "single" then
            for index, output in ipairs(server:outputs()) do
                if index == 1 then
                    output:place(0, 0);
                else
                    output:remove(); -- Excess displays are removed.
                end
            end
        end
    end
}
```
:::

::: warning
If your implementation neither places nor removes an output, it will remain in whatever configuration it was in previously, with no changes applied. This could be confusing when multiple profiles are in use on one system. It is recommended to either place or remove all displays each time this method is called by the server.
:::

::: info
The compositor will always select the preferred (native) resolution of a physical display. Changing to non-native modes on physical displays is not currently supported.
:::

This method is called when:
* The profile is activated or reloaded.
* An output is connected or disconnected.
* The active layout has been changed.

### arrange_views

| Method | `arrange_views(self)` |
| - | - |
| self | The profile object |
| Returns | Nothing |

This method is called by the compositor to allow the profile to arrange displayed program content (or views) in the logical layout space. The layout space is the same space in which the outputs are arranged in the `arrange_outputs` method. A view can be thought of as a window that displays all or part of a program's surface (or rendered content) one or more times in the layout. An implementation can take into account any number of factors, such as the currently-active layout, the number and resolutions of connected outputs, the list of connected processes, or other factors as desired.

When this method is not defined, the default implementation simply creates one view per program and places it at `0,0` in the layout, setting its size to fill the entire layout. If multiple programs are running, they will be placed on top of each other in an unspecified order. Therefore, the default behavior is only suitable for profiles that will be running a single program, such as a simple kiosk-style setup with one interface. In all other cases, profiles should define a custom implementation.

::: tip Example: Simply place views to fill the entire layout
```lua
profile {
    -- <other profile fields here>

    arrange_views = function(self)
        for _, surface in ipairs(server:surfaces()) do
            surface:place(0, 0);
        end
    end
}
```
:::

::: tip Example: Place one program per output by name
```lua
profile {
    -- <other profile fields here>

    processes = {
        ["DP-1"] = { "/path/to/some/program" },
        ["HDMI-A-1"] = { "/path/to/another/program" }
    },

    arrange_views = function(self)
        local surfaces = server:surfaces();
        local outputs = server:outputs();
        for _, surface in ipairs(surfaces) do
            surface:clear_views();
            local name = surface:name();
            for _, output in outputs do
                if name == output:name() then
                    local x, y, width, height = output:layout_box();
                    surface:place(x, y, width, height);
                end
            end
        end
    end
}
```
In this example, processes are created with a name that matches the desired output on which they should be displayed. If the required output is not connected, the program is simply not shown--although it is still running. Note the call to `surface:clear_views()` which ensures that any program not matched to a display is removed from the layout.
:::

::: info
Arranging outputs and views within the layout are very efficient operations. Therefore, it is perfectly fine performance-wise to re-create the layout each time the `arrange_outputs` and `arrange_views` methods are called. In fact, doing so tends to keep profile scripts much simpler and easier to read. The internal state of the layout is managed entirely by the compositor.

As a convenience, both the `surface:place()` and `output:place()` methods will remove any existing layout configuration for that surface or output, respectively, preventing accidental duplication.
:::

::: info
For greater control, and to perform advanced operations like view duplication or presenting only part of a program's surface, the `surface:set_size()`, `surface:add_view()`, and `surface:clear_views()` methods can be used.
:::

This method is called when:
* The profile is activated or reloaded.
* An output is connected or disconnected.
* The active layout has been changed.
* Any new process has connected to the compositor.
* Any process has disconnected from the compositor, usually because it terminated.

### refresh_processes

| Method | `refresh_processes(self)` |
| - | - |
| self | The profile object |
| Returns | Nothing |

This method is called by the compositor to allow the profile to start or stop processes as necessary. This method is almost never implemented by profile scripts unless some special process management is required by the project. In the vast majority of cases, processes will instead be defined using the `processes` field of a profile object. A typical implementation of this method might inspect the active layout, the connected outputs, the list of processes already running, and other factors, and then start or stop processes using API functions like `server:new_process()` and `process:stop()`.

The default implementation of this method looks at the profile's `processes` field, launching any processes that should be running but aren't, and, conversely, stopping any running processes that are not defined. It also re-launches any defined processes that have terminated.

This method is called when:
* The profile is activated or reloaded.
* An output is connected or disconnected.
* The active layout has been changed.
* Any processes has terminated.

### bus_message

| Method | `bus_message(self, data, is_binary)` |
| - | - |
| self | The profile object |
| data | A string containing the message payload |
| is_binary | A boolean value indicating whether the message is binary (a false value means it is safe to parse the payload as text) |
| Returns | Nothing |

This method is called whenever a message has been received from the message bus by any other message bus client. It is not called for messages that were sent by the script itself. A profile script may choose to parse the message and take some action in response, such as activating another layout or sending state information back through the message bus. This method is a good way for profile scripts to respond to custom web UIs or events in client programs. The default implementation does nothing.

This method is called when:
* Any message is received from another client connected to the message bus.

### key_event

| Method | `bus_message(self, sym, state)` |
| - | - |
| self | The profile object |
| sym | A string representation of the keyboard key symbol |
| state | An integer where 1 indicates that the key was pressed down, and 0 indicates that the key was released |
| Returns | A boolean indicating whether the key event was handled (no return value is equivalent to false) |

Each time an event occurs on any connected keyboard, the compositor will call this method. The `sym` parameter contains a symbol string indicating the affected key using whatever keyboard mapping is set by default on the system. Example values include `"A"`, `"Shift_L"`, `"Return"`, `"Escape"` and so on. 

::: info
For a complete list of possible symbol strings, see the [libxkbcommon definitions](https://xkbcommon.org/doc/current/xkbcommon-keysyms_8h.html). Note that the prefix `XKB_KEY_` is not included in the symbol string passed to this method.
:::

This method can decide whether any running programs should receive the key event or whether it should be captured by the profile script and not passed to running programs that may have keyboard input enabled. Returning `true` indicates that the key event was handled and should not be propagated further. Any other value, including no return value at all, indicates that the key event should continue to propagate.
