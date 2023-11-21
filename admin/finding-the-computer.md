# Finding the Computer

Once an isotope computer has been installed and enrolled/configured, the primary means of interaction with the computer for administrative purposes is via the network. In order to access the computer, you will need to know its hostname or IP address. There are a few ways to determine this.

1. Use the computer's device ID

This is generally the easiest option, when available. If the computer is configured to support multicast DNS, you can simply access it via the device ID with a `.local` suffix. For example, the web dashboard could be accessed using `http://isotope-123456.local` (replacing `isotope-123456` with your device ID). Similarly, the file shares can be accessed with a path like `\\isotope-123456.local` on Windows or `smb://isotope-123456.local` on Mac.

2. Use Salt to find the network configuration

If you have access to the Salt master server, you can [query the network information](./salt-cookbook#view-network-configuration) to retrieve the IP address.

3. Use the Cockpit UI to examine network interfaces

If enabled on your computer, you can use the global hotkey `Ctrl-Alt-F3` to access the Cockpit UI locally. Log in with the admin account credentials and view the `Network` tab.

4. Ask your IT administrator

If the computer is connected to a router managed by your IT department, they may be able to query the router and find the IP address of your computer.
