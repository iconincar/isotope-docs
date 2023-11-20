# Requirements

Most commodity desktop PC hardware may be used with isotope, provided that it is known to be Linux-compatible.

## Hardware Requirements

* A reasonably modern Intel or AMD x64 CPU.
* A motherboard that is known to be Linux-compatible. This is the case for most desktop motherboards, but some may include components that do not have Linux drivers.
* An AMD GPU. For driving up to six displays, the AMD Radeon Pro W6800 is the recommended GPU. Other AMD cards such as the Radeon RX 6800 XT may also be used.
  * For lightweight projects, the on-CPU integrated Intel or AMD GPUs are supported. These are appropriate for non-intensive single-display setups.
  * NVIDIA and Intel Arc GPUs are currently considered experimental for use with isotope, and should not be used outside of a lab environment at the time of writing.

It is possible to combine GPUs from the same manufacturer. For example, the Radeon Pro W6800 may be combined with the integrated GPU on an AMD Ryzen 5700G CPU to achieve 7 displays.

The isotope display server itself is very lightweight. Therefore, the specific CPU, RAM and storage requirements will be driven by the needs of your specific project. Projects using resource-intensive technologies such as Unreal Engine, or projects using many displays, may opt for higher-end components.

The recommended bare minimums are:
* 4-core CPU
* 10 GB storage
* 2 GB RAM

> isotope may also be used with "embedded" devices such as the ARM-based Raspberry Pi. This type of installation requires some special setup and is outside the scope of this document.

While specific laptop models may be certified in the future, laptops in general are not currently supported. If a physically small/light setup is desired, we recommend a small-form-factor desktop PC instead, provided it meets the above requirements.

## BIOS Setup

For pre-assembled computers, the factory-default BIOS settings are usually recommended, with one exception. If you are unable to boot from the isotope installation USB image, you may need to disable Secure Boot. For computers assembled from parts, it is usually recommended to enable the XMP memory profile for your installed RAM.

For setups that will use a combination of integrated GPU and discrete GPU, some motherboards require specific BIOS settings.

Due to the wide range of possible hardware configurations, this section is necessarily vague. Please refer to the user manual for your motherboard or PC for information specific to your hardware.

## Network Connectivity

While isotope-enabled computers can operate offline, the initial setup process requires Internet connectivity. The optimal connection method is via wired Ethernet to a LAN that provides DHCP services and access to the Internet. Before proceeding to the following sections, ensure that the computer is connected to an Ethernet port.

If wired Ethernet is not available, or if the LAN provides no DHCP services, manual network configuration is required. A boot option will be provided to allow for manual network configuration when required.

::: warning
If installing using Wi-Fi, your motherboard must have a Wi-Fi chipset with Linux drivers. Some Wi-Fi chipsets are known to be problematic. Alternatively, you may use a USB Wi-Fi adapter by plugging it in before starting installation.
:::

## Installation Media

A USB flash drive (a.k.a., thumb drive) is required to boot into the isotope installer. It should have at least 2GB capacity.

## Peripherals

Most computers will require at least a keyboard plugged in to configure BIOS settings and boot from the install media. Additionally, if you are using one of the boot options that requires manual input, it may also be convenient to connect a mouse. Once installed, neither of these devices are required by isotope unless your project specifically makes use of that kind of input.
