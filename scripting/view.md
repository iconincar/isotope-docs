# Object: view

A view is a visual object that displays the contents of a program's surface (in whole or in part) somewhere inside the layout. It is important to note that a view merely represents the visual content that is displayed, but it does not represent the program itself or even the program's surface.

Views are created using the [`place`](./surface#method-place) or [`add_view`](./surface#add-view) methods of the [`surface` object](./surface). A view may be removed by calling the [`destroy` method](./visual#method-destroy), or by calling [`clear_views`](./surface#method-clear-views) or [`clear_visuals`](./server#method-clear-visuals).

Views are almost always created inside the [profile's `arrange_views` callback method](./profile#method-arrange-views).

::: tip Example: create a single view for every program surface
```lua
local x, y, width, height = server:layout_box();
for _, surface in ipairs(server:surfaces()) do
    surface:place(x, y, width, height);
end
```
Each view fills the entire layout, stacked on top of each other.
:::

::: tip Example: display only the left half of a program's surface
```lua
surface:set_size(3840, 1080);
surface:add_view("left",
    0, 0, -- position in layout
    0, 0, 1920, 1080 -- position and size of view portal in surface pixels
);
```
Here we size the program to 3840x1080 and show only the left half of the content.
:::

There are no view-specific methods, but any of the [`visual` object's methods](./visual) may be used on views.
