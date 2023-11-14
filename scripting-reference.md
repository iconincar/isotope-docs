# Scripting Reference

## Registering profiles

This global function is used to register a profile, and is the main entry-point for almost all scripts:

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
Note that the function call parentheses are omitted here by convention, to make a profile script look more like a configuration file. In Lua, parentheses are optional when calling a function.
:::

## Object: profile

This section describes the fields and methods that can be added to a profile object that is passed to the `profile` function. Unlike most of the objects described in this document, the fields and methods attached to a profile object are defined by the user and are invoked or accessed by the compositor as needed.

### Fields

| Field | `name` (required) |
| - | - |
| Type | string |
| Required | Yes |

A unique identifier for the profile being defined. This string is used internally by the compositor, and may also be used by external tools, but it is not shown to the user.

| Field | `title` (required) |
| - | - |
| Type | string |
| Required | Yes |

A user-friendly display name for the profile, shown in UIs such as the web console.

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

### Methods

You can think of profile methods as user-defined callback functions that are invoked whenever certain events occur. The first argument (`self`) of each of these functions will always contain the profile object itself.

#### compute_layout

```lua
compute_layout(self)
```

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

#### arrange_outputs

```lua
arrange_outputs(self)
```

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

#### arrange_views

```lua
arrange_views(self)
```

This method is called by the compositor to allow the profile to arrange program content (or views) in the logical layout space. The layout space is the same space in which the outputs are arranged in the `arrange_outputs` method. A view can be thought of as a window that displays all or part of a program's surface (or rendered content) one or more times in the layout. An implementation can take into account any number of factors, such as the currently-active layout, the number and resolutions of connected outputs, the list of connected processes, or other factors as desired.

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

#### refresh_processes

```lua
refresh_processes(self)
```

This method is called by the compositor to allow the profile to start or stop processes as necessary. This method is almost never implemented by profile scripts unless some special process management is required by the project. In the vast majority of cases, processes will instead be defined using the `processes` field of a profile object. A typical implementation of this method might inspect the active layout, the connected outputs, the list of processes already running, and other factors, and then start or stop processes using API functions.

The default implementation of this method looks at the profile's `processes` field, launching any processes that should be running but aren't, and, conversely, stopping any running processes that are not defined. It also re-launches any defined processes that have terminated.

This method is called when:
* The profile is activated or reloaded.
* An output is connected or disconnected.
* The active layout has been changed.
* Any processes has terminated.




## Profile functions

Your profile may choose to implement certain functions. If they are not implemented, a default implementation is provided with basic fallback behaviors.

| Function name | Default behavior (when missing) |
| - | - |
| `compute_layouts(self)` | If the "layouts" table is defined in your profile, register those layouts. Otherwise, register a single layout named "default". |
| `refresh_processes(self)` | Use the "processes" table defined in the profile to launch processes, and re-launch them when they stop. If there is no "processes" table defined, nothing is launched. |
| `arrange_outputs(self)` | Place all outputs according to their native resolution with the top left corner at 0,0 in the virtual screen space. This effectively clones all screens, assuming they are the same resolution. |
| `arrange_views(self)` | Create views for all programs such that they fill the entire layout space. |
| `bus_message(self, data, is_binary)` | Does nothing. |
| `key_event(self, sym, state)` | Does nothing. |

Most profile functions take at least one parameter called `self`, which is always the first parameter. The self parameter refers to the profile object (or table in Lua parlance) of the currently-active profile. This provides a context, allowing your functions to access fields and functions defined in your profile

The `bus_message` function takes two parameters in addition to `self`. The first is a string containing the message, and the second a boolean value indicating whether the message was sent as a binary message or UTF-8 encoded text. A function implementation may decide how to handle the message based on its type.

The `key_event` function takes two parameters in addition to `self`. The first is a string indicating the name of the key that was pressed or released. The second indicates the state of the key (1 for key down, 0 for key up).

## Object: server

The server object is a global variable available to all functions. It provides the following methods:

| Method | Returns | Description |
| - | - | - |
| `outputs()` | Array of output objects | Gets all outputs (displays) currently active. See the output object section below. |
| `surfaces()` | Array of surface objects | Gets all surfaces for all programs currently running. See the surface object section below. |
| `processes()` | Array of process objects | Gets all currently-running processes as well as recently exited processes. |
| `layout_box()` | x, y, width, height | Returns the origin position and the size of the entire virtual screen space currently being used. |
| `register_layout(name, title)` | none | Should be called by the `compute_layouts()` profile function to add a layout to the list of available layouts. |
| `active_layout()` | layout name | Gets the name of the currently active layout. |
| `launch(name, owner, path/paths, args, env, options)` | process object | Launch a new process. Usually called by the `refresh_processes` profile function. The owner should usually match the profile name. The args and env parameters are arrays defining the command-line arguments and environment variables (in the format "NAME=VALUE") to be passed to the process. Options can be a table of key/value pairs. The path can either be a single string or a table of strings specifying paths to try. |
| `time_monotonic()` | number (whole and fractional seconds) | Get the current monotonic clock time, which is a timestamp that is guaranteed to increase over time regardless of clock changes. The value represents the number of seconds since some point in the past. It is useful to compute the amount of elapsed time since the last call. |
| `emit_signal(name, args...)` | none | Emit a D-Bus signal with optional argument(s). The signal name must be one of the signals defined on the profile's interface. |
| `emit_property_changed(names...)` | none | Emit a property changed event for one or more D-Bus properties. Usually called from a property setter. The property name(s) must match properties defined on the profile's interface. |
| `streams()` | Array of stream objects | Get all streams that currently exist. |
| `new_stream(name, pipeline, options)` | Stream object or nil on failure | Create a new stream set to a paused state with the specified name. The pipeline should be in a gstreamer pipeline description format. Options may be a table specifying certain options (see the stream object below for details). |
| `new_media_player(name, x, y, options)` | Media player object or nil on failure. | Create a new media player with the specified name and initial position (top left corner). The options parameter can either be a string, in which case it is interpreted as a media URI for playback. Otherwise, it must be a table containing various options. See the media player section below for a list of valid options. |
| `media_players()` | array of media player objects | Get all media players that currently exist. |
| `new_timer(callback, timeout, repeat)` | timer object | Starts a new timer and calls the callback either once, or repeatedly. The third parameter is optional. If it is missing or zero, the timer is called once and automatically destroyed. Both times are specified in whole and fractional seconds. |
| `bus_send_message(message, is_binary)` | none | Send a message to all clients connected to the message bus. The message parameter is expected to be a string type. The is_binary parameter, if true, indicates that clients should treat the message as a binary message, or as a UTF-8 encoded message if false or omitted. |
| `new_canvas(name, x, y)` | canvas object | Creates a new canvas with the specified name at the specified position in the layout. |
| `new_rect(name, x, y, width, height, r, g, b, a)` | rect object | Create a new solid rectangle with the specified position and dimensions. The color is specified in floating point values (0 to 1). |
| `clear_visuals()` | none | Destroys all visual objects. |
| `clear_timers()` | none | Destroys all timers. |
| `clear_streams()` | none | Destroys all streams. Streams owned by a media player will not be destroyed. |
| `clear_all()` | none | Destroys all objects. Often used in `arrange_views` to guarantee a clean slate. |
| `visuals()` | array of objects | Returns all visual objects, including views, canvases, and media players. |
| `new_group(name)` | the new group | Create a new group for holding visual objects. The group is empty. |
| `switch_layout(name)` | true for success | Initiate a layout switch. Usually called in response to external events such as message bus messages. |
| `switch_profile(name, [layout])` | true for success | Initiate a profile switch, and if the optional layout argument is present, also activate that layout. |
| `set_capture_box(x, y, w, h)` | none | Override the capture area for screenshots. Normally, the capture area is the same as the virtual layout. This must be called from the `arrange_views` method in order to have an effect, as the capture area is reset each time the output layout is updated. |
| `new_serial(path, read_callback, error_callback)` | serial connection object | Attempt to open a serial port by path. Returns nil if the opening was not successful. The read_callback and error_callback arguments are optional. |
| `new_virtual_output(name, description, width, height)` | true for success | Create a new virtual output with the given name/description and pixel dimensions. If the name is already in use by any other output, this function will fail. The description should be a human-readable string, commonly used to identify the output's function in your project. |
| `destroy_virtual_output(name)` | true for success | Destroy a virtual output by name. If the named output is not virtual, this function fails. |
| `clear_virtual_outputs()` | none | Removes all virtual outputs. |
| `hostname()` | hostname string | Gets the hostname of the computer on which isotope is running. This can be useful for scripts to distinguish between different environments, for example to use different output layouts in different locations while still running the same project. For more advanced logic, consider using environment variables instead (see Lua's `os.getenv()` function). |

## Object: output

Represents a single output or display. Use `server:outputs()` to get an array of these.

| Method | Returns | Description |
| - | - | - |
| `name()` | output name | The name of the output. Usually corresponds to the port the output is connected to, such as "HDMI-1" or "DP-1". |
| `size()` | width, height | Gets the display size in pixels. |
| `layout_box()` | x, y, width, height | Gets the position and size of the output in the virtual layout. |
| `place(x, y, rotation, scale)` | none | Place the output at the x, y coordinates in virtual screen space. The coordinates refer to the top left corner. The rotation parameter is an optional integer and defaults to 0, with valid values being 0, 90, 180, and 270. Arbitrary rotations are not supported. The scale parameter is an optional number and defaults to 1.0. |
| `remove()` | none | Remove the output from the virtual display. No content will be shown on the display (it will simply be black). |
| `set_gamma(temp, brightness, gamma_r, gamma_g, gamma_b)` | none | Adjust display parameters for this output. The temperature is specified in degrees Kelvin and is the only required parameter. Typical default values would be 6500, 1.0, 1.0, 1.0, 1.0. |

> NOTE: The values applied when calling `set_gamma()` are not persisted, unlike the settings in the console's display adjustments dialog. It is usually preferable to use the display's built-in adjustment controls when available, especially for brightness.

## Object: surface

Represents a single program's rendering surface. Use `server:surfaces()` to get an array of these.

| Method | Returns | Description |
| - | - | - |
| `place(x, y, width, height)` | view | Place a view on the virtual display. It will be placed at coordinates x, y (top left corner) and the surface will be resized to the specified dimensions in pixels. This shorthand function is the same as calling `surface:clear_views()` followed by `surface:set_size()` and `surface:add_view()`. |
| `set_size(width, height)` | none | Instruct the program owning the surface to resize the surface to a new size. |
| `name()` | view name | Gets the name of the view. This corresponds to the name given to the process that was launched by `server:launch()`. Take care that this may return `nil` for any views that do not belong to a known process. |
| `pid()` and `pgid()` | process ID | Return the Linux process ID (or process group ID) of the process that owns the view. The PGID will always correspond to the top-level process that was launched, but the PID may differ if the process is a child process. |
| `add_view(name, x, y)` | view | Add a view presenting the program's surface at the specified coordinates (upper left corner) in layout space. |
| `add_view(name, x, y, sx, sy, width, height)` | view | Same as the above, except four additional parameters are accepted, specifying the rectangle inside the surface that is displayed. This allows you to present a portion of the surface instead of the entire thing. Multiple calls can be made to this function to add multiple view portals. |
| `clear_views()` | none | Remove all added views. Effectively makes a program invisible. |
| `enable_keyboard()` | none | Enable keyboard input for this surface. If multiple surfaces have keyboard events enabled, they will all receive the key events. By default, surfaces receive no keyboard events. |
| `disable_keyboard()` | none | Disable keyboard input for this surface. If keyboard input was not previously enabled, this has no effect. |
| `set_flags(name, bool)` | none | Set or clear flags applied to the surface, depending on whether the second argument is true or false. See below for a list of available flags. This function should be called before views are created. |
| `set_input_region(rect, ...)` | none | Override the surface's input region, which is by default the entire surface. The region specified here takes precedence over any input region provided by the client. One or more rectangles may be provided as arguments, and each must be a table/array of integers in the form `{x, y, w, h}`. If no rectangles are provided, the input region will revert to the whole surface. |

> NOTE: If you use the `add_view()` function instead of the `place()` function, remember to call `surface:clear_views()` or `server:clear_visuals()` beforehand. Otherwise, many views will be created and "stack up". The `place()` method takes care of this for you.

The `set_flags()` function applies some optional special behaviors to the surface and views created by the surface. It is typically used to work around issues with programs that use older libraries.

| Surface Flag | Description |
| - | - |
| `ignore_opaque_regions` | When using transparent windows, some clients set incorrect opaque regions, which can cause rendering artifacts. Setting this flag overrides this behavior. |

## Object: view

Represents a visible view presenting a program's rendering surface. Usually the entire surface is presented, but if a view portal rectangle has been specified, the mew may contain only a portion of the surface. Use `surface:views()` to get an array of these.

| Method | Returns | Description |
| - | - | - |
| `name()` | name | Returns the object's name. |
| `set_position(x, y)` | none | Moves a visual without changing its size. |
| `raise_to_top()` | none | Brings the visual to the front of the group so that it is shown on top of any overlapping visuals in the same group. |
| `lower_to_bottom()` | none | Sends the view to the back of the group so that it is shown behind any overlapping visuals in the group. |
| `add_to_group(group)` | none | Adds the object to the group. |
| `remove_from_group()` | none | Removes the object from the group it's a member of, or takes no action if the object is not in a group. |
| `set_enabled(bool)` | none | Enable or disable the visual. Disabled visuals are not drawn, nor are any of their children. |
| `destroy()` | none | Removes the visual and deletes it. |

## Object: canvas

Represents a drawing surface on which the profile script can render its own content without launching an external program. Use `server:new_canvas()` to create a canvas.

| Method | Returns | Description |
| - | - | - |
| `name()` | name | Returns the object's name. |
| `set_position(x, y)` | none | Moves a visual without changing its size. |
| `raise_to_top()` | none | Brings the visual to the front of the group so that it is shown on top of any overlapping visuals in the same group. |
| `lower_to_bottom()` | none | Sends the view to the back of the group so that it is shown behind any overlapping visuals in the group. |
| `add_to_group(group)` | none | Adds the object to the group. |
| `remove_from_group()` | none | Removes the object from the group it's a member of, or takes no action if the object is not in a group. |
| `set_enabled(bool)` | none | Enable or disable the visual. Disabled visuals are not drawn, nor are any of their children. |
| `destroy()` | none | Removes the visual and deletes it. |
| `draw(width, height)` | drawing context | Start drawing the canvas. Drawing operations are provided by the drawing context. A draw operation always starts with a blank, fully transparent surface. |
| `commit()` | none | Finish drawing on the canvas and update the display with the new content. It is no longer possible to draw on the canvas until a new draw() operation is started. |

## Object: process

Represents a running or recently exited process. A process that has exited will be available during the next call to `refresh_processes` profile function so that the exit code can be inspected and the process optionally re-launched.

New processes are launched using the `server:launch()` method as described in the server section above. The flags argument, if provided, must be a table of key/value pairs. The supported flags are:

| Name | Type | Default | Description |
| - | - | - | - |
| `x11` | boolean | false | If true, processes are launched with a DISPLAY environment variable. Set this to true for programs that only support X11, and they will connect via XWayland. Note that this won't work if XWayland is disabled. This defaults to false. |
| `shell` | boolean | false | If true, the process is treated as a shell script which requires isotope to kill the entire process group when stopping a program. |
| `ignore_opaque_regions` | boolean | false | When using transparent windows, some clients set incorrect opaque regions, which can cause rendering artifacts. Setting this flag overrides this behavior. When this is set, the override will apply to all surfaces created by the process. |

> NOTE: If your processes are not properly terminating when they should, try setting the `shell` flag.

The method available on a process object are as follows:

| Method | Returns | Description |
| - | - | - |
| `name()` | process name | Gets the process name as defined by the `server:launch()` function.
| `is_running()` | true or false | Find out whether a process is currently running. |
| `exit_code()` | integer exit status | Gets the exit code returned by a stopped process. Returns 0 if the process is still running. |
| `launch()` | none | Re-launches this process. Does nothing if it is already running. |
| `stop()` | none | Stops the process by sending SIGTERM to all processes in its process group. The process is therefore given a chance to shut down gracefully by listening for this signal. |
| `owner()` | owner name | The name of the owner of this process, which is usually equal to the name of the profile under which the process was originally launched. |

## Object: stream

A stream is a generic media stream with no display. It can be used to route a media source to some destination, or perform different types of manipulation such as transcoding or filtering. A stream will generally not be used directly by a script author, but instead wrapped in a media player (see below).

Streams are created by calling the `server:new_stream()` method. The options parameter, if provided, must be a table and may contain some or all of the following fields:

| Name | Type | Description |
| - | - | - |
| `loop` | boolean | if true, on end of stream, automatically seek to the beginning and continue playing. Defaults to false. |
| `handler` | function | If set, the specified function will be called whenever certain events occur on the stream. See the stream object above for details. |

The handler callback is of the form `handler(stream, event_name, ...)` where stream is a reference to the stream object, and event_name is one of the following values. Additional arguments may be provided based on the event type.

| Event name | Additional args | Description |
| - | - | - |
| `state-changed` | new state string | The stream's state has changed. The state will be one of NULL, READY, PAUSED, PLAYING. Can be used to take action whenever a stream has been buffered and is ready to play, or has started playing. |
| `eos` | none | The end of the stream has been reached. |
| `error` | error code integer | An error was emitted during streaming. |
| `warning` | error code integer | A warning was emitted during streaming. |

A stream object's methods are as follows:

| Method | Returns | Description |
| - | - | - |
| `name()` | stream name | Get the name of the stream as defined when it was created. |
| `play()` | none | Put the stream in a playing state. |
| `pause()` | none | Put the stream in a paused state. |
| `seek(seconds)` | none | Request that the stream seek to the specified time in whole and fractional seconds. The seek may be deferred if the stream is not yet in a state where it is seekable. Most streams are only seekable in a paused or playing state. |
| `duratin()` | whole and fractional seconds or nil if unavailable | Request the stream's total duration which only makes sense if the underlying media is loaded and is not a live stream. |
| `time()` | whole and fractional seconds or nil if unavailable | Request the stream's current position. |
| `player()` | media player or nil | If a media player is controlling the stream, this can be used to get a reference to it. |
| `destroy()` | none | Stop the media stream and release its resources. The object is no longer valid to access. Note that streams that are managed by media players cannot be directly destroyed. Use the media player's destroy method. |

## Object: media_player

A media player wraps a stream and handles the presentation of media output inside a view, as if it were displaying content from a normal application. Note that no view object is actually created, but the player itself becomes part of the layout just as a view would. The easiest way to use a media player is to specify a URI referring to a local (e.g., file) or remote (e.g., network stream) resource.

Media players always start in a paused state. You may immediately call the play method to start playing, or seek to a specific time first. Some of the functions here will only apply to media streams that contain video. For audio-only streams, nothing is displayed but the audio is routed to the default output device.

Players are created using the `server:new_media_player()` method as described in the server section above. The options argument can simply be a URI such as a link to a media file starting with `http://` or `file://` or it can be a table containing some or all of the following fields:

| Name | Type | Description |
| - | - | - |
| `pipeline` | string | A full gstreamer-style pipeline specifying a custom set of elements, useful for doing advanced preprocessing. Note that the pipeline must contain an appsink element for video frames, named `videosink` and video frames must be converted to RGBA format. Cannot be specified if the uri option is specified. |
| `uri` | string | A URI referring to a media resource. Many types of URIs are suppored but `http://` and `file://` will likely be the most common. Cannot be specified if the pipeline option is specified. |
| `anamorphic` | boolean | If true, the video frames are not constrained to their natural aspect ratio. This allows for stretching if the media player size is different than the video size. Defaults to false. |
| `loop` | boolean | if true, on end of stream, automatically seek to the beginning and continue playing. Defaults to false. |
| `handler` | function | If set, the specified function will be called whenever certain events occur on the stream. See the stream object above for details. |
| `frame` | function(player, number) | If set, the specified function will be called whenever a frame is about to be presented (applies to video streams only). The player object is passed as the first argument and the second argument is the current time, in whole and fractional seconds. |

> NOTE: Since media players wrap stream objects, a corresponding stream with the same name is also created. Control of playback (such as seeking, pausing, etc.) is controlled through the stream object's interface documented above. Use the `stream()` method to get a reference to that object.

| Method | Returns | Description |
| - | - | - |
| `name()` | name | Returns the object's name. |
| `set_position(x, y)` | none | Moves a visual without changing its size. |
| `raise_to_top()` | none | Brings the visual to the front of the group so that it is shown on top of any overlapping visuals in the same group. |
| `lower_to_bottom()` | none | Sends the view to the back of the group so that it is shown behind any overlapping visuals in the group. |
| `add_to_group(group)` | none | Adds the object to the group. |
| `remove_from_group()` | none | Removes the object from the group it's a member of, or takes no action if the object is not in a group. |
| `set_enabled(bool)` | none | Enable or disable the visual. Disabled visuals are not drawn, nor are any of their children. |
| `destroy()` | none | Removes the visual and deletes it. |
| `stream()` | stream object | Get the underlying stream object, often required to control playback (pause, play, seek). |
| `set_size(width, height)` | none | Change the size of the media player. Depending on the options passed in at creation, the content may be sized to fit within the new size while maintaining its aspect ratio. |

## Object: timer

Timers are used to perform some action at a later time. They may be called once, or repeatedly if a repeat value is provided in the `server:new_timer()` method. Destroying a timer stops it immediately.

| Method | Returns | Description |
| - | - | - |
| `destroy()` | none | Stops a timer. No further callbacks will be performed. The object is no longer valid to access. |

## Object: group

Groups can be used to organize visuals. When visuals are together in a group, moving the group also moves everything within it, and disabling a group hides all of its members. Visuals in a group will also stay together with respect to layering, so sending a group to the back of front sends all members too.

If a visual object has not been added to a group, then it remains part of the collection retrieved from `server:visuals()`. Destroying a group also destroys all of its members. If an object is added to a group and is already a member of another group, it is removed from the other group.

When an object is a member of a group, setting its position will use coordinates relative to the position of the group.

| Method | Returns | Description |
| - | - | - |
| `name()` | name | Returns the object's name. |
| `set_position(x, y)` | none | Moves a visual without changing its size. |
| `raise_to_top()` | none | Brings the visual to the front of the group so that it is shown on top of any overlapping visuals in the same group. |
| `lower_to_bottom()` | none | Sends the view to the back of the group so that it is shown behind any overlapping visuals in the group. |
| `add_to_group(group)` | none | Adds the object to the group. |
| `remove_from_group()` | none | Removes the object from the group it's a member of, or takes no action if the object is not in a group. |
| `set_enabled(bool)` | none | Enable or disable the visual. Disabled visuals are not drawn, nor are any of their children. |
| `destroy()` | none | Removes the visual and deletes it, including all members. |
| `visuals()` | array of objects | Get all visuals that belong to the group. |

> NOTE: Since groups are themselves visual objects, they can be added to other groups to create a nested hierarchy. Cyclical graphs are not allowed (i.e., a group cannot be its own ancestor).

## Object: serial

A serial object represents a connection to a serial device. A simplified interface is provided for communicating with standard USB serial devices such as Arduino devices. The interface is non-blocking. The serial device is configured with standard parameters for USB serial devices (11520, 8 bits, no parity, 1 stop bit). These parameters are not currently configurable.

A serial port can be opened using the `server:new_serial(path, read_callback, error_callback)` method. The parameters are described here. Callers should check the return value for nil, which indicates that the device could not be opened.

| Parameter | Description |
| - | - |
| `path` | A device path, such as `/dev/ttyUSB0` or `/dev/ttyACM0`. The path must refer to a valid USB serial device or the open operation will fail. |
| `read_callback` | A function that takes a single string parameter containing any data read from the serial device. The caller is expected to collect, parse, or assemble individual data chunks as required. |
| `error_callback` | A function that takes no parameters. A call to this function is a signal that the serial device has encountered an unrecoverable error and no further data can be read or written. This is useful for detecting a disconnected device and scheduling a periodic operation to try re-opening it. The current serial device should be discarded by calling `destroy()` on it. |

A serial device implements the following methods:

| Method | Returns | Description |
| - | - | - |
| `destroy()` | none | Close the serial device and destroy this object. Any buffered data is discarded. |
| `write(data)` | none | Takes a string and writes it to the serial device. This method is non-blocking and the provided data is buffered. |

> NOTE: When switching profiles or shutting down the server, all opened serial devices are automatically closed.

## Logging

The following global functions allow a profile script to write to the server log. Lua string concatenation using double periods can be useful here. For example:

`log.error("Process named " .. myproc:name() .. "exited unexpectedly.")`

| Function | Description |
| - | - |
| `log.info(message)` | Log informative message. |
| `log.error(message)` | Log error message. |
