## Object: serial

A serial object represents a connection to a serial device. A simplified interface is provided for communicating with standard USB serial devices such as Arduino devices. The interface is non-blocking. The serial device is configured with standard parameters for USB serial devices (11520, 8 bits, no parity, 1 stop bit). These parameters are not currently configurable.

A serial device can be opened using the [`new_serial` method](./server#method-new-serial). See that method for options that can be configured when opening a serial device.

All serial devices are automatically closed when switching profiles or when shutting down the compositor.

::: tip Example: read bytes from a serial device and echo it back
```lua
local device = server:new_serial("/dev/ttyACM0",
    function(data)
        log.info("Read " .. #data .. "bytes from serial device");
        device:write(data);
    end,
    function()
        log.error("Serial device encountered an error");
    end
)
```
:::

## Method: write

| Signature | `write(data)` |
| - | - |
| data (string) | A string of bytes to be sent to the serial port. |
| Returns | Nothing |

Sends the specified data to the serial device. The data is not modified or encoded before being sent. This method is non-blocking, meaning data will be buffered and sent to the device as soon as possible. 

| Signature | `destroy()` |
| - | - |
| Returns | Nothing |

Closes the serial device and destroys the object. The object is no longer valid to use.
