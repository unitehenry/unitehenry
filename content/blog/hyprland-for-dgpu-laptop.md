+++
title = "Hyprland on dGPU Laptop"
date = "2025-11-14"
description = "Hyprland on dGPU Laptop"
tags = []
+++

!["Amazon Laptop"](/images/4743cffc-b34b-415c-8333-1e6f47be1efc.png)

Last year I bought this laptop to dual-boot Archlinux and Windows. I bought a dedicated NVMe drive, installed Arch, and setup a GRUB boot partition to switch between OS.

## My Setup

I strictly like to use a single monitor and keep my laptop lid shut. So after installing Arch and [Hyprland](https://hypr.land/), booting my laptop with lid shut and directly into Hyprland on my external monitor was problematic. I would have to first open my laptop lid, login to archlinux, and set Hyprland to use my dGPU over the iGPU.

## The Problem

After installing Arch and Hyprland, there's a couple problems that come with achieving my ideal setup:

- [Booting directly into desktop environment](#booting-directly-into-desktop-envrionment)
- [Switching between external monitor or laptop display](#switching-displays)
- [Choosing which OS to boot into](#dual-boot)

## Booting Directly Into Desktop Environment

By default, Arch uses [`agetty`](https://man.archlinux.org/man/agetty.8.en) to open a tty port, prompting login, and starting that user's shell. It comes with a `systemd` unit that looks like this:

```
[Service]
ExecStart=-/sbin/agetty --noreset --noclear --issue-file=/etc/issue:/etc/issue.d:/run/issue.d:/usr/lib/issue.d - ${TERM}
Type=idle
Restart=always
```

One thing nice about `agetty` is that is comes with a `--autologin`, so when my system starts it will open a shell for my user without having to login. With a simple bash script in my user's `.bashrc` file, I can invoke Hyprland at startup.

```sh
if command -v hyprland > /dev/null 2>&1; then
   if [[ -z "$HYPRLAND_INSTANCE_SIGNATURE" ]]; then
    hyprland
   fi
fi
```

First checking if the `hyprland` command exists, then checking the `HYPRLAND_INSTANCE_SIGNATURE` environment variable to know if the bash session is currently running in a Hyprland instance. If it's not, fire up Hyprland!

## Switching Displays

So now that my machine can fire up Hyprland from boot without ever having to touch the keyboard, there needs to be a way to know whether Hyprland should use the external monitor or laptop display. The default behavior for this is sending display primarily to the integrated display, and to the external monitor if connected. For my setup, I want it to only use the external monitor if connected.

### Detecting Monitor

My laptop has a discrete NVIDIA GPU that has an HDMI port which will be primarily used for connected external monitors. After installing the appropriate [NVIDIA drivers for Arch](https://wiki.archlinux.org/title/NVIDIA), I can detect if there is a display attached. The proprietary NVIDIA drivers come with an [`nvidia-smi`](https://docs.nvidia.com/deploy/nvidia-smi/index.html) utility which can be used to detect if a display is connected by doing the following:

```sh
$ nvidia-smi --query-gpu display_attached
display_attached
Yes
```

By modifying the `.bashrc` script, I can pipe this standard out into bash and use that to detect if Hyprland should prioritize this GPU display:

```sh
if command -v hyprland > /dev/null 2>&1; then
   if [[ -z "$HYPRLAND_INSTANCE_SIGNATURE" ]]; then
     DISPLAY_ATTACHED_OUT=$(nvidia-smi --query-gpu display_attached)
 
     if [[ $DISPLAY_ATTACHED_OUT == *"Yes"* ]]; then
       echo "external display connected";
       AQ_DRM_DEVICES="/dev/dri/card1:/dev/dri/card0" hyprland;
     else
       echo "external display disconnected";
       hyprland
     fi
   fi
fi
```

By setting the [`AQ_DRM_DEVICES`](https://wiki.hypr.land/Configuring/Multi-GPU/) environment variable prior to running `hyprland`, we can tell the compositor to prioritize the dGPU over the integrated Intel GPU. This will result in Hyprland only using the external monitor.

### Integrated GPU

Using the dGPU acceleration on the laptop display is something Hyprland does not support out of the box, and setting the `AQ_DRM_DEVICES` does not accomplish this either. This is because the laptop display is connected directly to the iGPU which the BIOS prioritizes over the dGPU by default. There is a UEFI setting that allows you to configure priority over dGPU, but this can only be accomplished if the hardware includes a MUX.

For my setup, I'm not concerned with GPU acceleration over the laptop display since I use [dual booting](#dual-boot) and do gaming on Windows.

## Dual Boot

!["GRUB Menu"](/images/3aeaf408-bf5a-4529-945f-efa8fd1e7e1a.jpg)
{ width="50%" style="display: block; margin: auto" }

> But if the laptop lid is closed, how do you choose to boot into Windows from the GRUB menu?

```sh
sudo grub-reboot 2 && reboot;
```

By using this bash script, I can do the following to boot into Windows:

1. Power on the device
2. Boot into Arch
3. Arch seamlessly load into Hyprland
4. NVIDIA SMI detects the monitor
5. Prioritize the dGPU for Hyprland
6. Hyprland sends display to the external monitor
7. Run `grub-reboot` to reboot into Windows

## Demo

*todo: film a video of the boot sequence :)*
