# Object: process

A process object represents a program that was launched and is managed by the compositor. A process is usually, but not always, an executable that connects to the compositor to display content and receive input. A process can also be a background service with no user interface.

Processes are most often created by the [`profile` object's `processes` field](./profile#field-processes). In most cases, it is best to allow the default process handling mechanism to manage processes. However, to manually launch and manage processes, the script author can implement a custom [`refresh_processes` profile callback method](./profile#method-refresh-processes).

Processes are automatically destroyed when the process ends (either normally or with an error code) and the process is not re-launched. By default, the compositor will automatically re-launch processes that end unless it has failed 5 times within 5 seconds of launch (an early exit condition). If the process has stopped too many times, it will be considered defective and will no longer be automatically re-launched in order to prevent filling up the logs. When a process is re-launched, it retains the same process object.

Any output written by the process (either to `stdout` or `stderr`) will be captured in the compositor's log and viewable in the isotope web console as well as the operating system logging facilities. Output emitted from programs will be tagged with the name of the profile and the process.

For examples on launching processes, see the [`profile` object](./profile).

The methods here are mainly only used by scripts when managing processes manually.

## Method: name

| Signature | `name()` |
| - | - |
| Returns | (string) The unique name the process was assigned when it was launched. |

The process name is assigned in the profile definition or when calling [`new_process`](./server#method-new-process). The name also corresponds to any [`surface` object](./surface) created by the process.

## Method: is_running

| Signature | `is_running()` |
| - | - |
| Returns | (boolean) True when the process is running, false when it has terminated. |

When this method returns true, the process has stopped for some reason and is eligible to be re-launched via the `launch` method. 

This method is almost always called by the [`refresh_processes` method](./profile#method-refresh-processes) when manually managing processes.

## Method: exit_code

| Signature | `exit_code()` |
| - | - |
| Returns | (integer or nil) The exit code returned by the program during termination, or nil if the process has not terminated. |

This retrieves the exit code returned from a process on exit. A value of `0` generally indicates no error, while any other value usually represents some kind of error code specific to that program. This can be used by scripts to take some appropriate action based on the program's result, and is also useful for logging.

This method is almost always called by the [`refresh_processes` method](./profile#method-refresh-processes) when manually managing processes.

## Method: launch

| Signature | `launch()` |
| - | - |
| Returns | (boolean) True if the program was successfully launched, false otherwise. |

Re-launches a process that has stopped. If the process is still running, this method does nothing. It is not possible to change the process parameters (arguments, environment variables, or flags) using this method; to accomplish that, a new process must be created.

This method is almost always called by the [`refresh_processes` method](./profile#method-refresh-processes) when manually managing processes. An implementation would likely inspect the results of the `is_running` and `exit_code` methods before deciding whether to re-launch a process.

When re-launched, the process will have a new PID (process ID) but will retain the same unique name and process object.

## Method: stop

| Signature | `stop()` |
| - | - |
| Returns | Nothing |

Attempts to gracefully stop a process by sending a `SIGTERM` signal to the process or the entire process group (depending on the value of the `shell` option used when creating the process). 

This method does not destroy the process object. That would occur sometime later after the process has actually terminated and the process has not been re-launched.

This method is almost always called by the [`refresh_processes` method](./profile#method-refresh-processes) when manually managing processes.

## Method: owner

| Signature | `owner()` |
| - | - |
| Returns | (string or nil) The name of the profile that launched the process, or nil if the process was launched by a service. |

This method can be used to determine whether the process was launched by a particular profile. 

This method is almost always called by the [`refresh_processes` method](./profile#method-refresh-processes) when manually managing processes.
