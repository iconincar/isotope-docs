# Object: canvas

It is possible for a profile script to render its own content to the screen without launching an external program. This is made possible by the `canvas` object and an integration with the Cairo graphics library. A canvas provides a comprehensive set of vector drawing tools, exposing most of the Cairo API.

The most common use cases for a drawing canvas are overlays, debugging output, on-screen logging, and masking of content drawn by other programs. By default, canvas surfaces are transparent and can be composed with content from other sources.

All of the information in the [Cairo API documentation](https://www.cairographics.org/manual/) applies to isotope's drawing canvases, with some special exceptions and modifications noted here.

The same canvas can be drawn to multiple times, but the display output will not be updated until the `commit` method is called. This prevents half-drawn content from being rendered to the screen. Here is a more complete example, which illustrates how to fill every display with a canvas. As displays are added and removed, canvases are re-created to match each output. One benefit of vector drawing is that the output can size itself to match the display without the scaling artifacts you'd get if you simply presented a bitmap image.

To begin drawing on a canvas, you must first call the `draw` method with the desired drawing size in pixels. This method returns a drawing context on which you can call most of the Cairo drawing functions.

The Cairo API is mapped to the script functions as follows:

* Prefixes on function names are removed. For example, `cairo_set_source_rgba(ctx, 1, 1, 1, 1)` becomes `ctx:set_source_rgba(1, 1, 1, 1)` or `ctx:set_source_rgba("#ffffffff")`.
* Prefixes on enumerations are removed and the values are lower-cased. For example, `cairo_set_antialias(ctx, CAIRO_ANTIALIAS_BEST)` becomes `ctx:set_antialias("best")`.
* Any function taking (r, g, b) or (r, g, b, a) values can also take string values in the form of an HTML5-style hex color string.
* Global functions and functions that create new objects are called through a global `drawing` table. For example, `cairo_image_surface_create_from_png(filename)` becomes `drawing.surface_create_from_png(filename)`.
* To create a new matrix, use `drawing.matrix_create()`. It will be initialized with all zeros. You can follow with functions like `matrix:init()` and `matrix:init_identity()` as if the matrix were a typical object.
* Some Cairo API features are not implemented. Specifically, low-level handling of glyphs, device objects, and specialized rendering surfaces like PDF and Xlib.
* Lifecycle methods like those that control references are not exposed, but instead the Lua garbage collector will destroy and free objects when needed. The one exception is that scripts may still call the `destroy()` method on most objects to explicitly free their resources. This is particularly useful for surfaces which may use a lot of memory. It is invalid to access an object after destroying it.
* The surface and contexts created by a `canvas` object are managed by isotope. Surfaces controlled by a canvas will be automatically destroyed when required. Use the `draw()` and `commit()` methods for content that will be displayed on screen. Manual creation of surfaces should only be done for intermediate tasks like masking or creating patterns.

::: tip Example: draw some graphics and text
```lua
local x, y, w, h = server:layout_box();
local canvas = server:new_canvas(output:name(), x, 0);
local ctx = canvas:draw(w, h);
local gradient = drawing.pattern_create_linear(w/2, 0, w/2, h);
gradient:add_color_stop_rgb(0, "#0000ff");
gradient:add_color_stop_rgb(1, "#000000");
ctx:set_source(gradient);
ctx:paint();

ctx:set_source_rgb("#ffffff");
ctx:move_to(50, 50);
ctx:line_to(w - 50, h - 50);
ctx:move_to(w - 50, 50);
ctx:line_to(50, h - 50);
ctx:set_line_width(25);
ctx:set_line_cap("round");
ctx:stroke();

ctx:set_font_size(48);
local tw = ctx:text_extents("Hello, World!").width;
ctx:move_to((w - tw) / 2, 100);
ctx:show_text("Hello, World!");

canvas:commit();
```
The image drawn here will fill the entire layout.
:::

For more drawing examples, see the [Cairo Cookbook](https://www.cairographics.org/cookbook/).

A `canvas` is a visual object and therefore exposes the same methods that all visuals provide. Only methods specific to the `canvas` object are listed here. See the [visual object](./visual) for common visual methods that may be used. Th remove and destroy a canvas from the layout, use the visual's [destroy method](./visual#method-destroy).

## Method: draw

| Method | `draw(width, height)` |
| - | - |
| width (integer) | The width of the desired drawing surface, in pixels. |
| height (integer) | The height of the desired drawing surface, in pixels. |
| Returns | A new canvas drawing context object. |

Begin a drawing operation. The returned object exposes most of the Cairo API. The provided size will determine the size of the drawing surface, as well as the size of the visual in the layout space. It is valid to call this method multiple times over a span of time, even with different dimensions. Once committed, the canvas will be sized to match the current dimensions. Note that nothing will be displayed or updated until the `commit` method is called.

The drawing surface will initially be fully transparent.

## Method: commit

| Method | `commit` |
| - | - |
| Returns | Nothing |

End a drawing operation and commit the contents of the drawing surface for display. If the drawing surface has a new size, the corresponding visual will be resized at this time. After calling this method, the drawing context is no longer valid. To draw again, a new context must be created by calling the `draw` method.
