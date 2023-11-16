# Lua Primer

This is a brief guide covering some of the nuances of the Lua scripting language that programmers coming from other languages like JavaScript might find surprising. It is not intended to cover the entire language or the built-in functions available with Lua. For a comprehensive language reference, see the official [Lua Documentation](https://www.lua.org/docs.html).

## Semicolons are optional

Like in JavaScript, a semicolon at the end of a statement is optional. By convention, this documentation uses semicolons at the end of statements.

::: tip Example: Equivalent statements
```lua
print("Hello, World!");
print("Hello, World!")
```
:::

## Functions can return multiple values

In Lua, functions can return zero, one or many values. A caller would access these values by providing a comma-delimited list of variables. By convention, an underscore (`_`) is used to indicate that the caller is not interested in that value.

::: tip Example: Using multiple return values from a function
```lua
function my_func() do
    return 1, 2, "three"
end
local _, val2, val3 = my_func();
print(val3);
```
:::

## Tables do a lot

A Lua table is roughly equivalent to a JavaScript object in that it can hold multiple values of varying types, and it can also act as an object with functions attached (referred to as methods in this context). When the compositor exposes some object to a Lua script, it is expressed in the form of a table object with methods.

::: tip Example: Tables as key/value structures
```lua
local my_table = {
    foo = "bar",
    baz = 42
};
```
:::

::: tip Example: Tables as arrays
```lua
local my_table = { 1, 2, 3 };
```
:::

::: tip Example: Tables as objects
```lua
local my_object = {
    value = 1,
    increment = function(self)
        self.value = self.value + 1;
    end
};
```
:::

::: tip Example: Iterating over a key/value table
```lua
local my_table = {
    x = 100,
    y = 200
};
for key, value in pairs(my_table) do
    print("The key " .. key .. " has value " .. value);
end
```
The built-in `pairs` function can be used to iterate over any table.
:::

## Arrays are 1-based

In contrast to most other languages, arrays in Lua are 1-based instead of 0-based by convention. That means that built in functions like `ipairs` and the length (`#`) operator expect arrays to start with a index of 1.

::: tip Example: Accessing array elements
```lua
my_list = {4, 8, 15, 16, 23, 42};
print("Should print 4: " .. my_list[1]);
print("Should print 42: " .. my_list[6]);
```
:::

## Arrays are just tables with integer keys

Lua has no dedicated array type, instead reusing the table type for this purpose. The main property of arrays that differentiate them from other tables is that they have sequential integer keys starting from `1`. The built-in function `ipairs` allows you to iterate over the values in an array. It returns two values: the index of the value and the value itself.

::: tip Example: iterating an array of integers
```lua
my_list = {4, 8, 15, 16, 23, 42};
for index, value in ipairs(my_list) do
    print("Value at index " .. index .. " is " .. value);
end
```
:::

::: tip Example: iterating an array of integers, discarding the index
```lua
my_list = {4, 8, 15, 16, 23, 42};
for _, value in ipairs(my_list) do
    print("Value is " .. value);
end
```
:::

## Function call parentheses are sometimes optional

When a function takes a single argument of a string or table type, the function parentheses are not required.

::: tip Example: Equivalent statements
```lua
print("Hello, World!");
print "Hello, World!";
```
:::

## Number type includes both integer and floating-point

Like JavaScript, Lua number types can be either an integer or a floating-point number (usually with 64-bit precision). The actual type of a number variable is determined by its contents.

## Method call syntax

Lua uses a colon operator (`:`) to denote that the call of a function inside a table is an object method. The only real difference is that when a colon is used, the table itself is passed as the first argument to the function (typically called `self` by convention).

::: tip Example: Equivalent statements
```lua
local my_table = {
    my_method = function(self, x)
        print("Passed " .. x .. " to method");
    end,
    my_regular_function = function(x)
        print("Passed " .. x .. " to regular function");
    end
};
my_table:my_method(1234);           -- these two
my_table.my_method(my_table, 1234); -- are equivalent

my_table.my_regular_function(1234);
```
:::

## Including other libraries

You can include other Lua libraries installed on the system. For example, if you need to do JSON parsing, you can include the luajson library by using the `require` statement at the beginning of your script file.

::: tip Example: Including the JSON library
```lua
require("json");
--
local obj = { foo = "bar" };
local str = json.encode(obj);
print(str);
local obj2 = json.decode(str);
print(obj2.foo);
```
:::
