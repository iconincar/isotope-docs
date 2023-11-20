# Salt Cookbook

This section covers some common operations that a Salt administrator might need to perform. It is by no means an exhaustive list of Salt's capabilities. For full details, see the [Salt documentation](https://docs.saltproject.io/en/latest/contents.html).

Throughout this section, the device ID `isotope-123456` will be used in examples. Replace this as appropriate. In salt parlance, computers managed by Salt are called minions. Most of these operations can target a single minion, all minions, or a subset of minions.

## List all Minions

`salt-key -A`

The output is split into sections:

* Accepted Keys: These computers are managed by Salt.
* Denied Keys: If a computer tries to enroll with a duplicate ID, it ends up in this section. If you are re-enrolling a computer, you will need to delete its old enrollment first.
* Unaccepted Keys: Computers waiting to be accepted or rejected. New minions appear here.
* Rejected Keys: Computer was rejected by an administrator.

## Accepting a Minion

`salt-key -a isotope-123456`

## Checking That a Minion is Online

`salt 'isotope-123456' test.ping`

## Applying Highstate

This core operation of Salt applies all specified states. On first run, this may take some time, as packages and/or project assets are downloaded.

If you are enrolling a new computer, you must first create the per-computer pillar file as described above.

`salt 'isotope-123456' state.apply`

Times when you should apply highstate include:

* You have enrolled a new computer.
* You have modified any of the states applied to that minion.
* It's time to update installed packages, such as the isotope server or project-specific setup packages.

## View Network Configuration

`salt 'isotope-123456' cmd.run 'ip addr'`

`salt 'isotope-123456' cmd.run 'ip route'`

## Reboot a Minion

`salt 'isotope-123456' system.reboot 0`

## Viewing Minion's System Logs

View all logs since boot:

`salt 'isotope-123456' cmd.run 'journalctl -b'`

View all isotope-specific logs since boot:

`salt 'isotope-123456' cmd.run 'journalctl -b -t isotope'`

View the last 100 log entries for the isotope server, excluding launched processes:

`salt 'isotope-123456' cmd.run 'journalctl -n 100 -t isotope ISOTOPE_SOURCE=server'`

View the last 100 log entries for an isotope-launched process called "myproject1" (this name matches the process name from your isotope profile script):

`salt 'isotope-123456' cmd.run 'journalctl -n 100 -t isotope ISOTOPE_PROCESS=myproject1'`

## Copying Files To a Minion

Usually, all files on a minion should be managed by Salt states, but sometimes you need to quickly update a config file or something for troubleshooting purposes. The file being copied must be uploaded to the Salt server first (use a tool like `scp`).

`salt-cp 'isotope-123456' /home/salt/myfile.txt /path/on/minion/myfile.txt`

To copy a binary file, add the `--chunked` parameter.

The salt mechanism for copying files is known to be slow. It's not a suitable distribution mechanism for large project assets. Those should be distributed through one of the other mechanisms (RPM package, OSTree repository).

Another way to copy files (in both directions) is to enable development mode and transfer files with `scp` directly to/from the minion.

## Copying Files From a Minion

The caveats from above apply in the other direction.

`salt 'isotope-123456' cp.push /path/on/minion/myfile.txt`

The file can be found on the Salt server at `/var/cache/salt/master/minions/isotope-123456/files/myfile.txt`.

## System-wide OS Update

Update all installed packages to the latest versions:

`salt 'isotope-123456' cmd.run 'dnf update -y'`

## Update a Specific Package

`salt 'isotope-123456' cmd.run 'dnf update -y <package-name>'`

> NOTE: Salt states can specify that the latest available package should be installed, so for those packages it is sufficient to simply apply a highstate to get the latest package. This is mostly useful for updating specific packages that are part of the OS distribution.

## List All Packages and Versions

To show all packages installed on a computer:

`salt 'isotope-123456' cmd.run 'dnf list --installed'`

## Show History For a Package

`salt 'isotope-123456' cmd.run 'dnf history list <package-name>'`

For details of a history entry:

`salt 'isotope-123456' cmd.run 'dnf history info <history-id>'`

## Restart isotope

If you have modified any of the isotope profile scripts by hand, or if you need to restart any programs that have been updated, you can restart isotope:

`salt 'isotope-123456' cmd.run 'systemctl restart kiosk'`

> NOTE: Most salt states that update profile scripts or running programs from the build server will automatically restart isotope when highstate is applied. This command is more useful when manually modifying things during development.

## List Available Profiles

`salt 'isotope-123456' cmd.run runas=kiosk 'isotopectl profiles'`

## Get Active Profile

`salt 'isotope-123456' cmd.run runas=kiosk 'isotopectl active-profile'`

## Switch Active Profile

`salt 'isotope-123456' cmd.run runas=kiosk 'isotopectl switch-profile <profile-name>'`

## List Connected Outputs

`salt 'isotope-123456' cmd.run runas=kiosk 'isotopectl outputs`

## Targeting Minions

There are numerous ways to target different groups of minions, so we'll only present a couple examples here. Refer to the Salt documentation for more comprehensive options.

When targeting multiple minions, it's possible that some minions are offline. You will receive an error message for those minions, but rest assured that the online minions will still execute the specified actions even if some were unable to.

Target a single minion:

`salt 'isotope-123456' ...`

Target all accepted minions:

`salt '*' ...`

Target all minions with a particular Pillar value:

`salt -I 'my-project-code:env:Development' ...`

This last form is commonly used by project-specific build jobs. It allows for performing actions (like applying a highstate) only to those minions which belong to the project, or both belong to the project and are tagged as a development or test machine. The specific pillar values used depend on the needs of the project.
