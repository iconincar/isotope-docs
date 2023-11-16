# Glossary

The isotope compositor and the Lua scripting language both define some terms that may be unfamiliar to script authors.

## Compositor

The core software component that manages programs, inputs, and outputs. In isotope's case, the compositor replaces a traditional desktop shell environment. The compositor also loads and runs user-created scripts, and provides a plethora of resources for script authors to control their projects' behaviors. The compositor's scripting API can be accessed through the `server` global variable in any script.

## Server

Synonymous with compositor. These two terms can be used interchangeably.

## Process

Any running executable program that was launched by a script. This includes both clients (programs that connect to the compositor and present content) as well as other programs that might run as background services.

## Client

A program that is running and connected to the compositor. This includes most programs that are launched by profile scripts. A client is a program that almost always has some kind of user interface or content to present, and therefore it would create surfaces containing pixel data.

## Surface

When a client renders some output, it is delivered to the compositor in the form of a surface. On a traditional desktop system, the surface would represent the content that you see inside an application's window.

## View

A visual object that presents either the full content of a client's surface, or some portion of that surface. A view is what you actually see on screen. In most cases, a program would have one view containing its entire surface, but in some specialty cases it is possible to have multiple views for a single surface.

## View Portal

A view that contains only a portion of a client's surface. A special term is warranted for this practice because it is specific to isotope and not a concept that exists on most traditional desktop systems.

## Visual

Any object that has a visual representation in the layout. This mostly includes program views, but could also include other visual objects created by scripts such as media players or drawing canvases. Each visual has a unique name.

## Output

A physical or device presenting content to the user. In many cases, an output is simply a physical display or screen. However, we specifically use the term "output" because isotope also supports virtual outputs, which are non-physical "fake" displays that can be used for special purposes like streaming video. When you see the term "output" you can basically just think "display" whether physical or not.

## Layout

An imaginary space in which outputs and views can both be arranged. You can think of this as a coordinate grid where the coordinates represent logical pixels. 

* If an output and a view are placed at the same location in the layout and they both have the same size, then the view is effectively "full screen" on that output. 
* If two outputs of the same size are placed in the same location, that display is effectively "cloned".
* Outputs and views may overlap in any desired combination.
* Outputs can be scaled to compensate for DPI differences between displays, and also rotated in 90-degree increments.

## Object

The term "object" as we use it here refers to a Lua table variable that might contain a mix of fields and/or methods. We call some of these an "object" to suggest that the table is linked to some specific concept or type in the compositor; in other words, it's something you can inspect and perform actions on rather than just being a loose connection of values.

## Method

In object-oriented programming, a method is like a regular function, except that it's attached to an object. Methods are used extensively in the scripting API. In Lua, methods always take the object itself as the first parameter, which by convention is called `self`. This is equivalent to a `this` variable in other OOP languages.

::: tip Example: invoking a method
```lua
local x, y, width, height = server:layout_box();
```
Methods are invoked by using the colon (`:`) operator on an object. Accidentally calling a method on a table using period (`.`) as in other languages instead of a colon will result in a runtime error since the expected `self` argument will not be passed.
:::

## Profile

A combined set of values and functions that define the behavior of a particular project. This includes things like which programs should be running and the layout configuration for outputs and views. Each script file almost always defines a single profile, hence we often refer to them as "profile scripts".

## Table

A Lua table is an all-purpose data structure that holds fields of any type. The most direct analogy is a JavaScript object with a set of keys and associated values. However, Lua's table type also serves to handle lists (arrays) since Lua does not have a dedicated array type. 

When used in an array form, a table simply has keys with integer values `1`, `2`, `3`, etc. An array can be iterated over using the `ipairs()` function, whereas a key-value table can be iterated over using the `pairs()` function.

::: tip Example: define an empty table
```lua
my_table = {};
```
:::

::: tip Example: define a list of integers and iterating
```lua
my_list = {4, 8, 15, 16, 23, 42};
print("Should print 42: " .. my_list[6]);
for index, value in ipairs(my_list) do
    print("Value at index " .. index .. " is " .. value);
end
```
:::

::: tip Example: define a table of key-value-pairs and iterating
```lua
my_list = {
    foo = "bar",
    baz = 42
};
print("Should print 42: " .. my_list["baz"]);
for key, value in pairs(my_list) do
    print("Value for key " .. key .. " is " .. value);
end
```
:::

::: warning One-based arrays
Remember that arrays in Lua are 1-based rather than 0-based as in many other programming languages. This can be a frequent source of errors for developers coming from other languages.
:::
