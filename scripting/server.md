# Object: server

This object contains the top-level methods that a script can use to either access information about the state of the compositor, or cause the compositor to perform some action. The server object is special in that there is only ever once instance of it, which may be accessed via the global `server` variable.

## Method: outputs

| Signature | `outputs()` |
| - | - |
| Returns | Array of [output objects](./output) |

Returns a list of all currently-connected outputs, whether or not they have been placed into the layout. This includes both physical and virtual outputs.

::: tip Example: inspecting all outputs
```lua
local outputs = server:outputs();
for _, output in ipairs(outputs) do
    local name = output:name();
    local width, height = output:size();
    log.info("Output " .. name .. " has size " .. width .. "x" .. height);
end
```
:::

## Method: surfaces

| Signature | `surfaces()` |
| - | - |
| Returns | Array of [surface objects](./surface) |

Returns a list of all surfaces from all clients connected to the compositor.

::: tip Example: logging all surfaces
```lua
local surfaces = server:surfaces();
for _, surface in ipairs(surfaces) do
    local name = surface:name();
    log.info("I have a surface belong to process named " .. name);
end
```
:::

## Method: processes

| Signature | `processes()` |
| - | - |
| Returns | Array of [process objects](./process) |

Returns a list of all processes managed by the compositor. This includes both processes that are running as well as processes that have recently terminated but have not yet been destroyed/cleaned up.

::: tip Example: logging all processes
```lua
local processes = server:surfaces();
for _, process in ipairs(process) do
    local name = process:name();
    log.info("I have a process named " .. name);
end
```
:::

## Method: layout_box

| Signature | `layout_box()` |
| - | - |
| Returns | (integers) x, y, width, height |

Returns the box representing the entire layout, which is defined as the total area covered by all outputs placed in the layout space. The x and y coordinates refer to the upper left corner of the layout, relative to the origin of `(0, 0)`. Placing a view using these coordinates and this size would result in the view spanning all outputs.

::: tip Example: Logging the bounds of the current layout
```lua
local x, y, width, height = server:layout_box();
log.info("The top left corner of the layout box is: " .. x .. "," .. y);
log.info("The size of the layout box is: " .. width .. "x" .. height);
```
:::

## Method: register_layout

| Signature | `register_layout(name, title)` |
| - | - |
| name (string) | An identifier, unique among all layouts in the profile |
| title (string) | A user-friendly display name for the layout used in UIs. |
| Returns | Nothing |

This method should be called only by the `compute_layouts` method in a profile object. It registers a valid layout for the current profile, based on whatever logic the script decides to use. This method is expected to be called repeatedly, once for each valid layout.

::: tip Example: the default implementation of `compute_layouts`
```lua
server:register_layout("default", "Default");
```
:::

## Method: active_layout

| Signature | `active_layout()` |
| - | - |
| Returns | (string) The name of the currently-active layout |

Gets the name of the active layout. This information is commonly useful to the profile methods `arrange_outputs` and `arrange_views` so that each method can apply the appropriate layout logic for the selected layout.

::: tip Example: inspecting the active layout
```lua
local layout = server:active_layout();
if layout == "horizontal" then
    -- specific layout logic
elseif layout == "vertical" then
    -- specific layout logic
else
    -- default layout logic
end
```
:::

## Method: launch

| Signature | `launch(name, owner, path, args, env, options)` |
| - | - |
| name (string) | An identifier for the process, unique to all processes launched by the profile |
| owner (string) | The name of the owning profile, or nil if the process is profile-independent |
| path (string OR array of strings) | A path to the executable to launch. If an array of paths is provided, the compositor launches the first one that exists and is executable. |
| args (array of strings) | A set of command line arguments to pass to the executable |
| env (array of strings) | A set of environment variables to pass to the executable, in the format `VARIABLE=VALUE` |
| options (table or nil) | An option set of options altering how the compositor treats the process (see below) |
| Returns | The new [process object](./process) or nil on error |

| Option | Default | Description |
| - | - | - |
| x11 (boolean) | false | When true, allow the process to use the Xwayland compatibility layer (for programs that don't support Wayland) |
| shell (boolean) | false | When true, treat the process as a shell script and kill its entire process group when terminating it |
| ignore_opaque_regions (boolean) | false | When true, always treat the program's entire surface as transparent; required by some programs to prevent visual artifacts when using transparent backgrounds |

This method causes a process to be launched by the compositor. This method is almost never called directly by profile scripts; instead, most script authors should use the `processes` field of the [profile object](./profile) to define which processes should run. In rare, advanced cases, a profile script might provide its own implementation of the `refresh_processes` method, in which case it may call this method.

## Method: time_monotonic

| Signature | `time_monotonic()` |
| - | - |
| Returns | (number) Whole and fractional seconds since some time in the past |

Get the current monotonic clock time, which is a timestamp that is guaranteed to increase over time regardless of clock changes. The value represents the number of seconds, whole and fractional, since some point in the past. It is mostly useful for computing elapsed times by calling it repeatedly. This method should not be used for getting the current wall-clock time. Lua has [built-in functions](https://www.lua.org/pil/22.1.html) for that purpose.

## Method: streams

| Signature | `streams()` |
| - | - |
| Returns | Array of [stream objects](./stream) |

Gets an array of all media streams that the compositor is managing, including any media streams used by the built-in [media_player object](./media_player).

## Method: new_stream

| Signature | `new_stream(name, pipeline, options)` |
| - | - |
| name (string) | A unique identifier for the stream |
| pipeline (string) | A GStreamer-compatible pipeline description |
| options (table or nil) | An optional set of key/value pairs specifying optional behaviors on the stream (see below) |
| Returns | The new [stream object](./stream) |

| Option | Default | Description |
| - | - | - |
| loop (boolean) | false | When true, automatically loop the stream back to the beginning when it has ended (not applicable to live streams) |
| handler (function) | nil | When set to a valid callback function, the function will be invoked when certain events occur on the stream |

Creates a new stream and puts it in a paused state. This method is not usually called directly by scripts, as it does not create any visual representation like a media player would. By itself, it is mainly useful for background transcoding and other advanced media operations. 

When provided via the options table, a handler callback takes the form `handler(event, ...)` where the `event` argument is one of:

| Event | Additional arguments | Description |
| - | - | - |
| eos | None | End of stream reached |
| warning | (string) message | A non-critical error has occurred |
| error | (string) message | A critical error has occurred |
| stage-changed | (string) state | The stream state has changed: valid state values are `NULL`, `READY`, `PLAYING`, `PAUSED` |

## Method: media_players

| Signature | `media_players()` |
| - | - |
| Returns | Array of [media_player objects](./media_player) |

Gets an array of all media players that the compositor is managing.

## Method: new_media_player

| Signature | `new_media_player(name, x, y, options)` |
| - | - |
| name (string) | A unique identifier for the stream |
| x (integer) | The left side of the media player in layout space |
| y (integer) | The top side of the media player in layout space |
| options (table or nil) | An optional set of key/value pairs specifying optional behaviors on the player (see below) |
| Returns | The new [media_player object](./media_player) |

| Option | Default | Description |
| - | - | - |
| loop (boolean) | false | When true, automatically loop the stream back to the beginning when it has ended (not applicable to live streams) |
| handler (function) | nil | When set to a valid callback function, the function will be invoked when certain events occur on the stream |
| uri (string) | nil | The location of the media to play in URL format |
| pipeline (string) | nil | A custom GStreamer pipeline. This option is mutually-exclusive with the `uri` option. |
| anamorphic (boolean) | false | If true, allow the video to be stretched to fill the media player size. If false, the aspect ratio will be preserved and the excess screen area will be transparent (letterbox or pillar box). |
| frame (function) | nil | When a callback function is supplied, it will be called every frame with the current frame time |

Creates a new media player positioned at the specified coordinates. The player will start in a paused state. To start playing the video, retrieve the stream using the `media_player:stream()` method and call its `stream:play()` method (see below for examples).

By default, the media player will be sized to match the content. A specific size may be set using the `player:set_size()` method. The media player is capable of playing audio-only media sources, and will have no visual representation or size in that case.

The URI option is required unless a custom pipeline is supplied. This should point to a remote or local media source using a URL scheme such as `https://example.org/media.mp4` or `file:///path/to/local/file.mp4`.

For more advanced scenarios, such as the playback of a remote RTP stream, or the output of a generated video pattern, a [GStreamer pipeline description](https://gstreamer.freedesktop.org/documentation/tools/gst-launch.html?gi-language=c) may be passed via the `pipeline` option instead. When using a custom pipeline, a GStreamer appsink must be defined named `videosink` or the media player will be unable to receive and present video frames. An appsink for audio is not required, as the default audio device will be used.

When provided via the options table, a handler callback takes the form `handler(event, ...)` where the `event` argument is one of:

| Event | Additional arguments | Description |
| - | - | - |
| eos | None | End of stream reached |
| warning | (string) message | A non-critical error has occurred |
| error | (string) message | A critical error has occurred |
| stage-changed | (string) state | The stream state has changed: valid state values are `NULL`, `READY`, `PLAYING`, `PAUSED` |

When provided by the options table, a frame callback takes the form `handler(time)` where the `time` argument is the time since the beginning of the media, in whole and fractional seconds. This callback can be useful to perform certain actions when a specific point in the source media is reached.

Media players can be created in the profile's `arrange_views` method, but it is also appropriate to start a media player in the profile's `start` method when you need the media to play immediately when the profile is activated.

::: tip Example: Play a local video file in a loop, filling the layout
```lua
local x, y, width, height = server:layout_box();
local player = server:new_media_player("myvideo", x, y, {
    uri = "file:///absolute/path/to/media/file.mp4",
    loop = true
});
player:set_size(width, height);
player:stream():play();
```
Since the `anamorphic` option is not set, the video's aspect ratio is preserved and it may not actually fill the entire layout.
:::

::: tip Example: Play a generated test pattern, filling the layout
```lua
local x, y, width, height = server:layout_box();
local player = server:new_media_player("testpattern", x, y, {
    "videotestsrc ! video/x-raw,width="..width..",height="..height..",format=RGBA ! appsink name=videosink"
});
player:stream():play();
```
:::

## Method: new_timer

| Signature | `new_timer(callback, timeout, repeat))` |
| - | - |
| callback (function) | The function to call when the timer fires |
| timeout (number) | The timer's delay in whole and fractional seconds |
| repeat (number or nil) | When not nil and not zero, the timer will, after the initial timeout, continue firing at this interval, specified in whole and fractional seconds |
| Returns | The new [timer object](./timer) |

Creates and starts a new timer. If the timer is not a repeating timer, it will be automatically destroyed when it is first fired. Otherwise, it will continue firing after the initial timeout using the specified repeat delay. Timers are useful for performing delayed or periodic actions. Timers operate on a 1-millisecond resolution, and are not necessarily guaranteed to fire exactly when desired depending on system load.

When using timers to perform animations, it is advisable to use them in combination with `server:time_monotonic()` so that timer drift can be mitigated.

::: tip Example: Make a timer that fires after 5 seconds and then destroys itself
```lua
server:new_timer(function()
    log.info("My timer fired!");
end, 5.0);
```
:::

::: tip Example: Make a timer that fires once per second
```lua
server:new_timer(function()
    log.info("My timer fired!");
end, 1.0, 1.0);
```
:::

::: tip Example: Timer that uses profile state
```lua
profile {
    -- other profile fields

    timer = nil,
    timer_count = 0,
    start = function(self)
        self.timer = server:new_timer(function()
            self.timer_count = self.timer_count + 1;
            log.info("My timer has fired " .. self.timer_count .. " times");
            if self.timer_count >= 10 then
                self.timer:destroy();
            end
        end, 1.0, 1.0);
    end
}
```
This timer is created when the profile is activated, and then fires every second. After it has been fired 10 times, the callback destroys the timer and it no longer fires.
:::

## Method: bus_send_message

| Signature | `bus_send_message(data, is_binary)` |
| - | - |
| data (string) | The message payload. |
| is_binary (boolean) | True if the message is binary, otherwise it will be treated as UTF-8 encoded text |
| Returns | Nothing |

Send a message to all clients connected to the message bus. This is often used to communicate internal profile state out to one or more programs or custom web UIs.

## Method: new_canvas

| Signature | `new_canvas(name, x, y)` |
| - | - |
| name (string) | An identifier for the canvas, unique among all visuals. |
| x (integer) | The left side of the drawing canvas in layout space |
| y (integer) | The top side of the drawing canvas in layout space |
| Returns | The new [canvas object](./canvas) |

Create a new drawing canvas upon which vector drawing operations can be performed. This object provides a simple way to draw basic graphical information and text to the screen, and is often useful for debugging or very simple user feedback. The canvas itself has no inherent size until it is drawn to by calling the `canvas:draw()` method. See the [canvas object](./canvas) for more information.

## Method: new_rect

| Signature | `new_rect(name, x, y, width, height, r, g, b, a)` |
| - | - |
| name (string) | An identifier for the rectangle, unique among all visuals. |
| x (integer) | The left side of the drawing canvas in layout space |
| y (integer) | The top side of the drawing canvas in layout space |
| width (integer) | The width of the rectangle in pixels |
| height (integer) | The height of the rectangle in pixels |
| r (number) | The red color component as a decimal value between 0 and 1 |
| g (number) | The green color component as a decimal value between 0 and 1 |
| b (number) | The blue color component as a decimal value between 0 and 1 |
| a (number) | The alpha component controlling transparency, where 0 is completely transparent and 1 is completely opaque. |
| Returns | The new [rect object](./rect) |

Create a basic rectangle with a solid color for display. A rectangle is a very simplistic object that is mainly only useful for debugging or for mocking up different layouts. Rectangles of different colors can be added to a layout to ensure that outputs and views are aligned correctly.

::: tip Example: make a solid blue rectangle filling the layout
```lua
local x, y, width, height = server:layout_box();
server:new_rect("myrectangle", x, y, width, height, 0.0, 0.0, 1.0, 1.0);
```
:::

## Method: clear_visuals

| Signature | `clear_visuals()` |
| - | - |
| Returns | Nothing |

Destroy all visuals. This includes all `view`, `media_player`, `canvas` and `rect` objects. Non-visual objects such as `timer`, `stream` and `process` are not destroyed. This can be used at the beginning of an `arrange_views` implementation to ensure that the layout is starting from a clean slate on each call.

## Method: clear_timers

| Signature | `clear_timers()` |
| - | - |
| Returns | Nothing |

Stop and destroy all timers.

## Method: clear_streams

| Signature | `clear_streams()` |
| - | - |
| Returns | Nothing |

Stop and destroy all streams, except those being managed by `media_player` objects. This destroys streams created by calling the `new_stream` method.

## Method: clear_all

| Signature | `clear_all()` |
| - | - |
| Returns | Nothing |

Destroy all objects created by the profile, including visuals, streams, and timers. This effectively resets the compositor back to an empty state, as if the profile had just been activated.

## Method: visuals

| Signature | `visuals()` |
| - | - |
| Returns | Array of visual objects of varying types |

Gets an array containing all visual objects, including `view`, `media_player`, `canvas`, `rect` and `group` objects.

## Method: new_group

| Signature | `new_group(name)` |
| - | - |
| name (string) | An identifier for the group, unique among all visuals |
| Returns | The new [group object](./group) |

Creates a new, empty [group object](./group) which contains no visuals. A group is a collection of one or more visuals that are positioned together. In other words, when a group is moved, all visuals within that group are moved. Visuals of any type may be added to a group, including other groups, to create a nested tree structure for more complicated layouts.

## Method: switch_layout

| Signature | `switch_layout(name)` |
| - | - |
| name (string) | The unique identifier of the layout to switch to |
| Returns | Nothing |

Switches to one of the available layouts for the active profile. The profile is not changed or restarted. Calling this method will cause the `arrange_outputs` and `arrange_views` methods to be called almost immediately, with the new active layout applied. This is often done in response to some event, such as a message bus message from a custom UI.

::: tip Example: Switch to the "custom" layout
```lua
server:switch_layout("custom");
```
:::

## Method: switch_profile

| Signature | `switch_profile(name, layout)` |
| - | - |
| name (string) | The unique identifier of the profile to switch to |
| layout (string or nil) | If provided, specifies the layout to activate within the destination profile; otherwise, the first available layout will be used by default |
| Returns | Nothing |

Switches to one of the available profiles. If the specified profile is already active, it will be re-activated. Calling this method will cause the new profile to be activated as if it were selected by a user, with all corresponding callbacks being invoked. This is often done in response to some event, such as a message bus message from a custom UI.

::: tip Example: Switch to the "myproject" profile with "custom" layout
```lua
server:switch_profile("myproject", "custom");
```
:::

## Method: set_capture_box

| Signature | `set_capture_box(x, y, width, height)` |
| - | - |
| x (integer) | The left side of the capture box in layout space |
| y (integer) | The top side of the capture box in layout space |
| width (integer) | The width of the capture box in pixels. |
| height (integer) | The height of the capture box in pixels. |
| Returns | Nothing |

Normally, when a screenshot is captured by the web console or via a remote tool through the `/capture` endpoint, the entire layout is captured and sent. However, it is possible for profile scripts to override this behavior in some very special cases. This method is very rarely used.

