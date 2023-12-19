# System Configuration

As noted in the [enrollment section](./enrollment) a [Pillar file](https://docs.saltproject.io/en/latest/topics/tutorials/pillar.html) for each computer is created as part of the enrollment process. This section will examine the following configuration file and explain each section. Pillar files are always in [YAML format](https://docs.saltproject.io/en/latest/topics/yaml/index.html).

```yaml
# Lab computer, assembled 2023-11-21, Seattle, WA USA
include:
  - projects.mycompany.secrets
system:
    highstate-on-startup: False
    services:
        ssh: True
        smb: True
        avahi-daemon: True
        cockpit: True
        nginx: True
        NetworkManager-wait-online: False
        mosquitto: False
    proxy:
        isotope: True
        cockpit: True
    firewall:
        ssh: True
        http: True
        samba: True
        mdns: True
        protopie-connect: True
        mosquitto: False
    systemd:
        enable-user-core-dumps: True
    udev:
        enable-teensy-rules: True
        enable-thumbdrive: True
        allow-serial: True
    admin:
        enable-shell: True
        password: PASSWORD HASH HERE
        enforce-password: True
        enable-sudo-no-password: True
        password-nt: PASSWORD HASH HERE
        authorized-keys:
          - ssh-rsa ... PUBLIC KEY HERE
protopie-connect:
    enable: True
kiosk:
    enable: True
isotope:
    enable-remote: True
    enable-cockpit-hotkey: True
    enable-desktop: True
    env:
      - ISOTOPE_AUTO_RELOAD=1
      - ISOTOPE_REMOTE_ICE_SERVERS=stun:stun.l.google.com:19302
    packages:
      - my-custom-fonts
projects:
    mycompany:
      - myproject1
      - myproject2
myproject1:
    env: test
myproject2:
    env: prod
```

## Device Description

```yaml
# Lab computer, assembled 2023-11-21, Seattle, WA USA
```

Since minion names in our naming scheme can be opaque, it is a good practice to add some information at the top of the file, perhaps including the purpose of the device, its location, which project(s) it's for, and so on.

## Includes

Other pillar files may be included within the configuration file. In this case, we include some company-specific secrets such as cryptographic keys that can be used to authorize a particular computer to receive materials protected by cryptographic authentication. Rather than repeat the same information in each configuration, it is contained in a centralized file that is included wherever needed.

```yaml
include:
  - projects.mycompany.secrets
```

The path here includes a file located at `pillar/projects/mycompany/secrets.sls` relative to the root of your admin repository. Note that according to Salt convention, the path separator (`/`) is replaced by periods (`.`) and the filename extension is omitted.

## System Section

The `system` section configures options relevant to the base operating system.

### `highstate-on-startup`

When set to true, the computer will automatically apply a new highstate when it first boots and connects to the Salt master server. This can be useful in some environments, but may not always be appropriate as updates to software projects and other content may take some time to download after boot, which can in turn cause certain services and processes to be restarted unexpectedly. To prevent any unwanted interruptions, leave this option set to `False` and manually apply highstate when desired.

### `services`

Determines which services are automatically started on system boot. 

* The `ssh` service can be enabled to 
* The `smb` service is required for computers that host a shared drive for direct deployments. The `samba` [firewall rule](#firewall) must also be enabled to access the shared drive remotely.
* The `avahi-daemon` service allows computers to be identified by name using multicast DNS. The `mdns` [firewall rule](#firewall) must also be enabled.
* The `cockpit` service must be enabled to use the Cockpit web-based system administration UI. To access Cockpit remotely, the `nginx` service must be enabled, the `cockpit` [proxy rule](#proxy) must be enabled, and the `http` [firewall rule](#firewall) must also be enabled.
* The `NetworkManager-wait-online` rule is a special service that runs only at startup. When set to `True`, the system will wait until at least one network interface is online before completing the boot process. This can be useful if your projects need to immediately access network resources. However, this may cause a delay in startup when no network is available. For computers that will primarily be used offline, this should be set to `False`.
* The `mosquitto` service provides an MQTT broker that can be used for inter-program communications as an alternative to the isotope message bus.

### `proxy`

Some services are remotely accessed through a reverse proxy. In order for any of these services to work, the `nginx` [service](#services) must be enabled, and the `http` [firewall rule](#firewall) must be enabled.

### `firewall`

Configure which firewall rules are enabled. In order for various services to be accessed remotely over a network, their corresponding firewall rule must be enabled. Otherwise, the service will only be available to the local computer (which is desired in some insecure environments).

### `systemd`

Generic options relating to the management of services and processes.

* `enable-user-core-dumps` enables the automatic saving of core dumps when a process crashes. This can be useful when debugging.

### `udev`

This section covers options related to external devices.

* `enable-teensy-rules` enables communication with Aruino-based Teensy devices for any user.
* `enable-thumbdrive` enables automatic updates via encrypted packages written to a USB drive.
* `allow-serial` enables serial port reads and writes by any user on every serial device.

### `admin`

This section covers options related to the `admin` user account. An admin account can be used to perform administrative actions via SSH or the Cockpit web UI, and can also deploy content via file share(s).

* `enable-shell` enables SSH access. Note that the [service](#services) and [firewall rule](#firewall) must also be enabled to access the computer remotely. The admin account must either have an assigned password or have at least one entry in the `authorized_keys` section.
* `password` is the SHA-256 hashed password the admin would use with SSH or sudo. If no password is set, then keypair authentication is required for SSH logins using the `authorized-keys` setting.
* `enforce-password` optionally resets the admin password each time a highstate is applied. Set this to `False` to allow local password changes without reverting the password.
* `enable-sudo-no-password` optionally enables access to `sudo` with no password by the logged in admin.
* `password-nt` specifies a password for use with any shared drives. This is a separate option from `password` above because of the different hashing algorithm.
* `authorized-keys` is an array of public SSH keys, configuring who is able to log in to the admin account via SSH without using a password.

::: tip Exapmle: Creating an SHA-256 password hash
To create a password hash for the password "password" (replace this with a real password):
```bash
mkpasswd -m sha256crypt 'password'
```
This command is suitable for creating passwords for the `password` option above.
:::

::: tip Example: Creating an NT password hash
To create a password hash for the password "password" (replace this with a real password):
```bash
echo -n 'password' | iconv -t utf16le | openssl md4 -provider legacy
```
This command is suitable for creating passwords for the `password-nt` option above. On some systems, the legacy openssl provider must be enabled by editing the `/etc/ssl/openssl.cnf` configuration file.
:::

## ProtoPie Connect section

The `protopie-connect` section determines whether the ProtoPie Connect Embedded service is installed and enabled.

* `enable` enables the installation of the ProtoPie Connect Embedded service and starts it on boot.
* `license` contains the text of the license file received from ProtoPie for this device. Without a license file, the service will only run for 10 minutes at a time.

The process for procuring a ProtoPie Connect license for a particular computer involves the following steps:

1. Retrieve the ProtoPie Device ID by looking at the `protopie-connect` service's logs.

When directly logged into the computer via SSH:

```
journalctl -u protopie-connect -n 100
```

When logged into the Salt master server:

```
salt isotope-123456 cmd.run 'journalctl -u protopie-connect -n 100'
```

2. Send the device ID to your ProtoPie sales contact, requesting a license for some length of time.

3. When the license file is received, paste its contents as a single line into the `license` field.

## Kiosk Section

This section controls options relating to kiosk mode, which configures the system to boot directly into some service such as `isotope` instead of a standard desktop UI or login screen.

* `enable` enables kiosk mode. For most computers running isotope with hardware displays connected, this should be set to `True`.

## isotope Section

This section controls configuration options related to isotope itself. When this section is present in the file, it will be installed and launched automatically on boot, provided that the `enable` option is also set in the `kiosk` section.

* `enable-remote` enables remote streaming of isotope outputs. To access the web console, the reverse proxy must be enabled and allowed via the firewall.
* `enable-cockpit-hotkey` enables a global hotkey `Ctrl-Alt-F3` to locally access the Cockpit web UI via a connected display. This requires the `cockpit` service to be enabled, but does not require the reverse proxy or firewall rules. The admin user must log in using a password.
* `enable-desktop` enables global hotkey to switch to a local desktop environment as a fallback option for certain situations. The admin user must log in using a password.
* `env` is an array of environment variables that will be passed to isotope. These are system-specific values that control isotope's behavior. See the [section below](#environment-variables) for a detailed list. Each entry in the list takes the format `VARIABLE=VALUE`.
* `packages` specifies a list of additional OS-level packages that may be required by your projects. This can include packages form the upstream OS repository, or from any custom repository that has been enabled.

### Environment Variables

These are the environment variables recognized by isotope. They can be placed in the `env` list inside the [`isotope` section](#isotope-section). Beware that setting some of these manually may interfere with the normal operation of isotope and with other settings in the configuration file, as some of those options also set environment variables.

| Variable | Default | Description |
| - | - | - |
| `ISOTOPE_SCRIPT_PATH` | `/usr/share/isotope/scripts;/etc/isotope/profiles.d` | Directories to search for scripts to load. Built-in scripts provide core functionality, and additional scripts are defined by developers to establish profiles for their projects. |
| `ISOTOPE_STARTUP_PATH` | `/etc/isotope/startup.d` | Directories to search for startup shell scripts (not Lua) that will be executed before the server is started. These are mostly used to execute per-machine setup tasks. |
| `ISOTOPE_PRIMARY_DRM` | unset | When set, specifies a path to a stable device node representing the primary GPU. For example, by setting this value to something like "/dev/dri/by-path/pci-0000:2c:00.0-card" you can ensure that isotope uses the correct GPU as the primary. This only really applies to multi-GPU systems. |
| `ISOTOPE_WEB_ROOT` | `/usr/share/isotope/wwwroot` | The directory from which the console web application static files are served. |
| `ISOTOPE_WEB_DISABLE` | unset | When set to any value, disable the built-in web server and console. |
| `ISOTOPE_WEB_PORT` | 5000 | Override the port that the web server is started on, for console access and websockets. |
| `WLR_SCENE_DISABLE_DIRECT_SCANOUT` | unset | When set to 1, disable direct scan-out. This may be needed when using multiple GPUs. |
| `ISOTOPE_LOG_LEVEL` | 2 | Sets the log level. 0 for silent, 1 for error, 2 for info, 3 for debug. |
| `LWS_LOG_FLAGS` | 1027 | Bitwise flags for libwebsockets logging. See libwebsockets documentation/code for details. You can usually leave this alone. |
| `WLR_X11_OUTPUTS` and `WLR_WL_OUTPUTS` | 1 | When running nested within an Xorg or Wayland session, specifies the number of windows to create, with each window corresponding to a virtual output device. |
| `WLR_RENDERER` | gles2 | Specifies which back-end renderer isotope should use for compositing. Most common values are `gles2` and `vulkan`. |
| `ISOTOPE_AUTO_RELOAD` | unset | When set to 1, watches script directories for file changes and automatically reloads all scripts. This is very useful during development and testing, but is not recommended in production to avoid unexpected side effects. |
| `ISOTOPE_CUSTOM_MODE` | unset | Set custom output size and optionally refresh rate for nested compositor windows, useful for development. Expects a value in the format `1920,1080` or `1920,1080@60` |
| `ISOTOPE_HEADLESS` | unset | When set to 1, isotope will run with only virtual displays. Physical displays connected to GPUs will not be used, and when run nested in another compositor, no window will be created. |
| `ISOTOPE_REMOTE_ENABLE` | unset | When set to 1, enables the remote service, allowing web browsers and other clients to view and interact with running programs. |

When the remote service is enabled, the following additional environment variables may be used:

| Variable | Default | Description |
| - | - | - |
| `ISOTOPE_REMOTE_WEB_ROOT` | `/usr/share/isotope/wwwroot/remote` | The directory from which the web-based remote UI application is served. |
| `ISOTOPE_REMOTE_WEB_PORT` | 5100 | Override the port that the remote web server is started on, for UI access and websockets. |
| `ISOTOPE_REMOTE_LOG_LEVEL` | 2 | Set the log level specifically for the remote viewer component. The possible values are the same as the `ISOTOPE_LOG_LEVEL` variable above. |
| `ISOTOPE_REMOTE_ICE_SERVERS` | unset | Provide a list of ICE/STUN servers used when reflecting public IP address information. This should be a comma-delimited list in the format `stun:example.org:19302` |

## Projects Section

The `projects` section is a dynamic section that is specific to particular projects. It can be used to deploy custom projects that were packaged as part of an automated build pipeline. The options here will depend on the Salt definitions for your particular project. Secured projects may require certain secrets to be deployed to the computer via the [`include` section](#includes).

The example here includes Salt recipes from the `salt/projects/mycmopany` folder.

## Per-Project Sections

Each project or environment can additionally specify their own sections. These sections are free-form and any names may be used as long as they don't clash with other sections. The example here defines a `mycompany` project group with a value `env` set to `test`. This serves as a convenient way to organize groups of devices.

::: tip Example: Apply highstate to all computers with the `mycompany`.`env` value set to `test`
```bash
salt -I 'mycompany:env:test' state.apply
```
:::
