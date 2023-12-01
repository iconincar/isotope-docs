# Object: surface

A surface represents the content that a a program is rendering. It provides no visual representation (it is not a visual object) and therefore it has no position in the layout, but it does inherently have a size. In order to display the contents of a surface in the layout, views must be created using the methods found here. See the [`view` object](./view) for examples.

A surface is automatically created by the compositor when a program connects to it and begins rendering content. A surface is automatically destroyed when its owning program disconnects (usually when it is terminated). When a surface is destroyed, all of its corresponding views are also destroyed.

## Method: name

| Signature | `name()` |
| - | - |
| Returns | (string) The name of the process that created the surface. |

Retrieves the name of the surface, which always matches the unique name assigned to the program's process when it was launched. This allows scripts to correlate a surface with a program that was launched by the same script, in order to place its views properly.

## Method: add_view

| Signature | `add_view(name, x, y, sx, sy, width, height)` |
| - | - |
| name (string) | An identifier for the view, unique amongst all visuals. |
| x (integer) | The desired position of the left side of the view in the layout. |
| y (integer) | The desired position of the top side of the view in the layout. |
| sx (integer or nil) | Optionally, the left side of the view portal in pixels; defaults to `0`. |
| sy (integer or nil) | Optionally, the top side of the view portal in pixels; defaults to `0`. |
| width (integer or nil) | Optionally, the width of the view portal. |
| height (integer or nil) | Optionally, the height of the view portal. |
| Returns | The new [`view` object](./view) |

Creates a new view, presenting some or all of the surface's content in the layout. If the optional view portal arguments are omitted, all of the surface's content will be presented. See the [`view` object](./view) for examples using this method.

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: clear_views

| Signature | `clear_views()` |
| - | - |
| Returns | Nothing |

Destroys all views created for this surface, removing them from the layout. After calling this method, none of the program's content will be visible, but the program will still be running.

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: place

| Signature | `place(x, y, width, height)` |
| - | - |
| x (integer) | The position of the left side of the new view in the layout. |
| y (integer) | The position of the top side of the new view in the layout. |
| width (integer) | The desired width of the content in pixels. |
| height (integer) | The desired height of the content in pixels. |
| Returns | The new [`view` object](./view) or `nil` |

This is a convenience method that is used when a single view containing the entire rendered content of the program is desired. The view is positioned in the layout at the specified location, and the surface is re-sized to match the desired size.

If the width or height are zero (or less than zero) then the view cannot be created and this method will return `nil`.

This method is functionally equivalent to the following:

```lua
surface:clear_views();
surface:set_size(width, height);
surface:add_view("UNIQUE_ID", x, y);
```

This method generates a unique ID for the surface and uses that as the view name. This unique name will stay the same for the lifetime of the surface, so calling this method repeatedly will result in the same view name. Some clients create multiple "windows" or surfaces. It is safe to use this method for each of those surfaces, and a single view will be created for each.

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: place_on

| Signature | `place(output_name, [output_name]...)` |
| - | - |
| output_name (string)... | One or more output names as separate arguments. |
| Returns | The new [`view` object](./view) or `nil` |

This method works exactly like the [`place` method](#method-place) except it takes one or more output names instead of coordinates and size. This allows the caller to conveniently place a surface to fill a single output, or span multiple outputs. When spanning multiple outputs, the view is placed such that it fills the entire bounding box defined by all of those outputs.

If none of the listed outputs have been added to the layout, then this method does nothing and returns `nil`.

::: tip Example: Fill a single output (full-screen)
```lua
surface:place_on("DP-1");
```
:::

::: tip Example: Span multiple outputs, filling both
```lua
surface:place_on("DP-1", "HDMI-A-1");
```
Note that if both outputs here do not form a rectangle together (in other words, they are not directly adjacent or are not the same size in the layout) then both outputs will still be filled, but some parts of the program's content may not be visible.
:::

## Method: set_size

| Signature | `set_size(width, height)` |
| - | - |
| width (integer) | The desired width of the content in pixels. |
| height (integer) | The desired height of the content in pixels. |
| Returns | Nothing |

Inform the program that owns the surface that it should render content at the new size. The new size takes effect in the layout after the program renders its content at the new size, so the effect is not always immediate. Calling this method is the equivalent of resizing a window in a traditional desktop environment.

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: enable_keyboard

| Signature | `enable_keyboard()` |
| - | - |
| Returns | Nothing |

Allow the program owning this surface to receive keyboard input events, as long as they are not handled by the script itself. Keyboard input is not enabled by default.

::: warning
If more than one surface has keyboard events enabled, they will **all** receive keyboard input events simultaneously. Unlike with a traditional desktop, isotope has no concept of a "focused" window with respect to input.
:::

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: disable_keyboard

| Signature | `disable_keyboard()` |
| - | - |
| Returns | Nothing |

Disallow the program owning this surface from receiving any keyboard inputs. This may be called after `enable_keyboard()` to turn keyboard events off again for the surface. Keyboard events are disabled for each surface by default.

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: set_input_region

| Signature | `set_input_region(regions...)` |
| - | - |
| regions... (tables) | A varying number of region tables in the form {x, y, w, h} where all values are integers. |
| Returns | Nothing |

By default, surfaces accept pointer and touch inputs across all visible portions of the surface. It is sometimes useful to restrict which parts of a surface may receive input, especially when the surface has transparency with other content behind it. For example, this method can be used to "punch a hole" through one surface so that inputs may be passed through to another surface underneath it.

Note that input regions apply to the surface, and thus the provided coordinates are relative to the top-left corner of the surface, **not** the views created to present a surface. This is an important distinction to keep in mind when displaying partial surface contents using view portals.

This method takes a variable number of arguments. Each argument must be an array of four integers specifying the `x, y, width, height` of a region that should accept input. Any location that is not within any of the defined regions will be ignored by this surface ans passed through to any surfaces underneath it.

If no regions are specified (the method is called with no arguments) then the entire surface will receive input. This is the default state of every surface.

::: tip Example: Only accept input from the top left and bottom right corners
```lua
surface:set_size(1920, 1080);
surface:set_input_region(
    { 0, 0, 200, 200 },
    { 1920 - 200, 1080 - 200, 200, 200}
);
```
The surface will take a size of 1920x1080 and will only accept input in 200x200 squares in the top left corner and bottom right corner.
:::

::: tip Example: The entire surface accepts and consumes input
```lua
surface:set_input_region();
```
:::

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

## Method: preferred_output

| Signature | `preferred_output()` |
| - | - |
| Returns | (string or nil) The name of the output on which the client would like the surface to be displayed, or nil if the surface doesn't have a preferred output. |

Some clients may request that a surface be placed on a particular output in a full-screen configuration. This request can be honored or ignored depending on your script logic. If a nil value is returned, then the client has not requested a preferred output.

## Method: title

| Signature | `title()` |
| - | - |
| Returns | (string or nil) The title assigned to the surface by the client. |

In a traditional desktop environment, this would correspond to the window title. Scripts may use this for logging purposes or to make decisions about placement.

## Method: app_id

| Signature | `app_id()` |
| - | - |
| Returns | (string or nil) A name that uniquely identifies the application. |

This value usually corresponds to the program's executable name. In a traditional desktop environment, it is often used to group multiple windows together when they belong to the same application. Your script may use this value to make decisions about placement.

## Method: pid

| Signature | `pid()` |
| - | - |
| Returns | (integer) PID of the owning process.|

Returns the process ID of the process that created the surface, typically used for debug logging.

## Method: pgid

| Signature | `pgid()` |
| - | - |
| Returns | (integer) PGID of the owning process.|

Returns the process group ID of the process that created the surface, typically used for debug logging.

