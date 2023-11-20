# Admin Guide

This guide is intended for those who are setting up, maintaining, and configuring one or more isotope computers.

The high-level process of setting up an isotope computer involves installing the base OS from a USB drive, enrolling the computer using the Salt server, and deploying initial configuration and content to the computer. [Salt](https://saltproject.io) is an orchestration system designed to manage computing devices remotely. It is recommended that those who will be managing isotope computers via Salt get familiar with the [Salt documentation](https://docs.saltproject.io/en/latest/contents.html).

The steps of installing the base OS and enrolling the device with Salt can be performed separately by different people. This can be useful when setting up a computer at a remote location.

* [System Requirements](./requirements)
* [Writing Install Media](./install-media)
* [Installation](./installation)
* [Enrollment](./enrollment)
* [Salt Cookbook](./salt-cookbook)
