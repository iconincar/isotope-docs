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
| Returns | The new [`view` object](./view) |

This is a convenience method that is used when a single view containing the entire rendered content of the program is desired. The view is positioned in the layout at the specified location, and the surface is re-sized to match the desired size.

This method is functionally equivalent to the following:

```lua
surface:clear_views();
surface:set_size(width, height);
surface:add_view(surface:name(), x, y);
```

This method is almost always called by the [`arrange_views` profile callback method](./profile#method-arrange-views).

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
