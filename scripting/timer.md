# Object: timer

Timers are used to perform some action at a later time. They may be configured to fire once or repeatedly.

Timers are created using the [`new_timer` method](./server#method-new-timer). See that method for detailed options that may be used when creating a timer and for usage examples.

If a timer is not a repeating timer, it is automatically destroyed when the timer fires. Any timer may be stopped using the [`destroy` method](#method-destroy) after which it will not fire. All timers are automatically destroyed when switching to a new profile or when the current profile is re-activated.

The configuration of a timer cannot be changed after it has been created. Instead of modifying a timer, destroy it and create a new one.

Timers operate on a 1-millisecond resolution, and are not necessarily guaranteed to fire exactly when desired depending on system load. When using timers to perform animations, it is advisable to use them in combination with the [`time_monotonic` method](./server#method-time-monotonic) so that timer drift can be mitigated.

## Method: destroy

| Signature | `destroy()` |
| - | - |
| Returns | Nothing |

Destroys the timer, preventing any future callbacks from being called. After calling this method, the timer object is no longer valid to use.
