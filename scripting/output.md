# Object: output

An output is either a physical display connected to the computer or a virtual output created by a script.

When it represents a physical display, the output object is automatically destroyed and removed from the layout when the physical display is no longer available (for example, if it has been unplugged or switched off). When it represents a virtual output, the output is destroyed when the [`destroy_virtual_output` method](./server#destroy-virtual-output) is called.

Virtual outputs can be created using the [`new_virtual_output` method](./server#new-virtual-output).

Nothing will be displayed on an output until it is added to the layout via the [`place` method](#method-place). The compositor will always use the native/preferred display resolution of a physical display. Scaling can be achieved when placing the output in the layout.

## Method: name

| Signature | `name()` |
| - | - |
| Returns | (string) The unique name of the output. |

Retrieves the output's name. For physical displays, this corresponds to the port that the output is connected to. Names come in the form `DP-1`, `HDMI-A-1`, etc. Take note that swapping the connections for two displays will also swap their names (the names do not follow the physical screen itself).

## Method: size

| Signature | `size()` |
| - | - |
| Returns | (integers) width, height |

Retrieves the output's size in pixels. For physical displays, this is the native, un-scaled and un-rotated resolution of the screen.

## Method: place

| Signature | `place(x, y, rotation, scale)` |
| - | - |
| x (integer) | The desired position of the left side of the output in the layout. |
| y (integer) | The desired position of the top side of the output in the layout. |
| rotation (integer or nil) | The rotation to apply in 90-degree clockwise increments. Valid values are `0`, `90`, `180`, `280`. |
| scale (number or nil) | The scale to apply, where `1` applies no scaling. |
| Returns | Nothing |

Place the output in the layout with a desired position and size. Any visual content within that area of the layout will be displayed on this output. An optional rotation and scale may be applied.

Note that when using the scale parameter, the value refers to the scale of the content. In other words, passing a scale of `2` will render the content twice as large, effectively halving the resolution of the display. In that sense, it be thought of as an inverse-scale as applied to the screen resolution.

Once placed in a layout, an output will retain that configuration until it is either explicitly removed using the [`remove` method](#method-remove) or it is destroyed.

This method is almost always called by the [`arrange_outputs` profile callback method](./profile#method-arrange-outputs).

## Method: remove

| Signature | `remove()` |
| - | - |
| Returns | Nothing |

Removes an output from the layout. Once removed, content will no longer be rendered on the output and it will instead show a black screen. If the output was not already in the layout, this method does nothing.

## Method: layout_box

| Signature | `layout_box()` |
| - | - |
| Returns | (integers) x, y, width, height |

If the output has been placed in the layout, this returns the position and effective size of this output in the layout. The width and height may not necessarily match the native resolution of the screen if the output was scaled or rotated when placed in the layout.

## Method: set_gamma

| Signature | `set_gamma(temp, brightness, gamma_r, gamma_g, gamma_b)` |
| - | - |
| temp (integer) | The desired color temperature in degrees Kelvin, where `6500` is standard. |
| brightness (number or nil) | Optionally, the desired brightness in the range `0.0` to `1.0`. |
| gamma_r (number of nil) | The gamma power value to apply for the red channel, defaulting to `1.0`. |
| gamma_g (number of nil) | The gamma power value to apply for the green channel, defaulting to `1.0`. |
| gamma_b (number of nil) | The gamma power value to apply for the blue channel, defaulting to `1.0`. |
| Returns | Nothing |

Apply coarse adjustments to the display parameters for this output. Whenever possible, it is highly recommended to instead use the built-in display adjustments on a physical display when available. Note that the brightness value here does not affect the backlight of a display, so the result is inferior compared to built-in screen adjustments. This method is mostly useful to help correct for distracting color temperature differences between multiple displays.

Note that the values configured by this method are not persisted. To apply persistent settings, it is instead recommended to use the web console to adjust the output.

This method is not supported on virtual outputs.
