# Logging

Functions are provided for writing log output from scripts. When a script emits a line of text into the log, it is written to the OS system log and is also viewable in the isotope web console. Log entries emitted from scripts are mixed in with log entries emitted by the compositor itself.

Note that these functions are not methods, and thus the colon (`:`) operator is not used when calling them. They are simply grouped together into a global table variable called `log`.

Whether or not a particular log entry is actually emitted depends on the maximum log level that isotope is configured with. By default, only `INFO` and `ERROR` log entries are emitted.

## Function: log.info

| Signature | `log.info(message)` |
| - | - |
| message (string) | The text to be written as a line in the log. |

Write a line to the log with the `INFO` log level.

::: tip Example: write a string to the log
```lua
log.info("Log message here.");
```
:::

## Function: log.error

| Signature | `log.error(message)` |
| - | - |
| message (string) | The text to be written as a line in the log. |

Write a line to the log with the `ERROR` log level.

## Function: log.debug

| Signature | `log.debug(message)` |
| - | - |
| message (string) | The text to be written as a line in the log. |

Write a line to the log with the `DEBUG` log level.
