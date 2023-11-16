# Object: group

Groups can be used to organize visuals. When visuals are together in a group, moving the group also moves everything within it, and disabling a group hides all of its members. Visuals in a group will also stay together with respect to layering, so sending a group to the back or front sends all of its members too.

If a visual object has not been added to a group, then it remains part of the collection retrieved from the [`server` object's `visuals` method](./server#method-visuals). Destroying a group also destroys all of its members. Likewise, enabling or disabling a group using the [`set_enabled` method](./visual#method-set-enabled) will enable or disable all members of the group.

If an object is added to a group and is already a member of another group, it is removed from the other group.

When an object is a member of a group, setting its position will use coordinates relative to the position of the group.

Since groups are themselves visual objects, they can be added to other groups to create a nested hierarchy. Cyclical graphs are not allowed (i.e., a group cannot be its own ancestor).

A `group` is a visual object and therefore exposes the same methods that all visuals provide. Only methods specific to the `group` object are listed here. See the [visual object](./visual) for common visual methods that may be used. To destroy a group and remove it from the layout, use the visual's [destroy method](./visual#method-destroy).

## Method: visuals

| Signature | `visuals()` |
| - | - |
| Returns | (array of varying types) The members of the group or an empty array. |

Returns all visuals of varying types that have been added to the group.
