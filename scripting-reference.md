## Logging

The following global functions allow a profile script to write to the server log. Lua string concatenation using double periods can be useful here. For example:

`log.error("Process named " .. myproc:name() .. "exited unexpectedly.")`

| Function | Description |
| - | - |
| `log.info(message)` | Log informative message. |
| `log.error(message)` | Log error message. |
