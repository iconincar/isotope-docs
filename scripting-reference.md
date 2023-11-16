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
