# Object: Visual

A visual is an abstract object that provides a set of common methods for all objects that appear in the layout. In object-oriented programming parlance, the visual is a base class for the following object types:

* [view](./view)
* [canvas](./canvas)
* [media_player](./media_player)

All visuals must possess a unique name. If a new visual is created using any method with a name that clashes with an existing visual, the existing visual will be destroyed and replaced by the new visual object.

This section describes the methods that are common to all of these visual types.

## Method: name

| Signature | `name()` |
| - | - |
| Returns | The identifier of this visual, unique amongst all visuals. |

Retrieves the name of the visual, as assigned by the script when the visual was created. 

## Method: set_enabled

| Signature | `set_enabled(enable)` |
| - | - |
| enable (boolean) | True to enable the visual, false to disable it. |
| Returns | Nothing |

Enables or disables the visual. A disabled visual still exists, but is not visible anywhere in the layout. This is an easy method to toggle the visibility of any object as desired. If the visual is a [group](./group) then all of its child objects are also affected.

## Method: set_position

| Signature | `set_position(x, y)` |
| - | - |
| x (integer) | The desired position of the left side of the visual in layout space. |
| y (integer) | The desired position of the top side of the visual in layout space. |
| Returns | Nothing |

Moves the visual so that its top left corner is at the desired position, relative to the layout origin of `(0,0)`. If the visual is a [group](./group) then all of its child are moved to keep their relative position within the group.

## Method: raise_to_top

| Signature | `raise_to_top()` |
| - | - |
| Returns | Nothing |

Causes the visual to be presented on top (or in front) of all other visual objects. Calling this method repeatedly on different visual objects is an easy way to ensure a "stacking order" for those objects.

If the visual is a member of a group, this method only places the affected object in front of all other objects **in that group**.

## Method: lower_to_bottom

| Signature | `lower_to_bottom()` |
| - | - |
| Returns | Nothing |

Causes the visual to be presented underneath (or behind) all other visual objects.

If the visual is a member of a group, this method only places the affected object behind of all other objects **in that group**.

## Method: add_to_group

| Signature | `remove_from_group(group)` |
| - | - |
| group ([`group` object](./group)) | The group to which the object should be added. |
| Returns | Nothing |

Adds the visual to a group. See the [`group` object](./group) for more details on groups.

If the visual is already a member of a group, it is first removed from that group and then added to the new one. A visual cannot be a member of multiple groups.

## Method: remove_from_group

| Signature | `remove_from_group()` |
| - | - |
| Returns | Nothing |

Removes the visual object from a group. If the visual is not a member of a group, then this method does nothing.

## Method: destroy

| Signature | `destroy()` |
| - | - |
| Returns | Nothing |

Removes the visual from the layout and destroys it. The object is no longer valid and should not be used again. Any resources used by the object will be released.
