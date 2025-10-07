---
title: 'Hardware Overview and OS Setup'
description: 'Overview of the hardware components and operating system setup for the homelab'
---

# Page Content


---

# Notes:

about to install the OS into one of the more powerful machines that I have to reuse. Its an old macbook pro, but its from about 2012. I used this computer for a long time and daily drove arch linux on it, so getting linux running on this machine should not be too difficult.

I installed alma linux onto a bootable USB drive using the minimal disk image of alma 10. Your favorite ISO burning tool should work fine. balenaEtcher, rufus, Disk Destroyer, its all the same. Plug in the USB drive, and boot from it by either changing the boot order in the bios, or by using the boot menu. On these old macbooks, you hold down the option key while booting to get to the boot menu, and you can select the USB drive from there.

Should have been easy. What happened with me was when I selected the EFI boot from the menu, everything just froze. I suspect that this is because the minimal boot image is designed to run headless and is not connecting to the display properly. I can find some people with similar issues and I would eventually like to run a minimal image and use my own window manager if any, so I am going to avoid running the full Alma image and try and repair the minimal image to usability.

After doing some reading I have decided to first test and see if I can get it to open with either the full drive or the boot ISO. The DVD ISO is full featured but is also over 6GB. The flash drive I was using was only 4GB, so I had to use a different flash drive. How annoying. The Boot disk is smaller and requires pulling everything from the network, but that also has been complicated on this machine before because of driver issues for this old wifi card. In order to route around that, I am going to run and Ethernet over USB connection from my phone to the computer and use my phone to share its internet connection.

The Boot image had the same issue as the minimal image. I am going to assume the same issue will happen with the full image so I don't have to look for a different flash drive. I found [this](https://www.reddit.com/r/AlmaLinux/comments/pkao9s/almalinux_on_macbook_pro/) person describing the same issue, and that linked to an old guide titled [Installing CentOS on Apple Hardware](https://gist.github.com/codello/f70973b1106978722eb2016b8b37b801). I originally was going to use centos for the server but it has been deprecated, I went with alma linux instead because of its compatibility with RHEL and following the ethos of centos. The guide is old but it may have some useful information.

The first thing this guide mentions to do is open the flash drive on another computer that can access the contents. On mac or windows this may be a little weird, but the machine I'm going to put this on is already loaded with arch linux using my personal dotfiles, so I can just plug the flash drive in and mount it. The guide says to open the file `/EFI/BOOT/grub.cfg`, mine looked like this: 

```cfg
set default="1"

function load_video {
  insmod efi_gop
  insmod efi_uga
  insmod video_bochs
  insmod video_cirrus
  insmod all_video
}

load_video
set gfxpayload=keep
insmod gzio
insmod part_gpt
insmod ext2

set timeout=60
### END /etc/grub.d/00_header ###

search --no-floppy --set=root -l 'AlmaLinux-10-0-x86_64-dvd'

### BEGIN /etc/grub.d/10_linux ###
menuentry 'Install AlmaLinux 10.0' --class fedora --class gnu-linux --class gnu --class os {
	linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=AlmaLinux-10-0-x86_64-dvd quiet
	initrdefi /images/pxeboot/initrd.img
}
menuentry 'Test this media & install AlmaLinux 10.0' --class fedora --class gnu-linux --class gnu --class os {
	linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=AlmaLinux-10-0-x86_64-dvd rd.live.check quiet
	initrdefi /images/pxeboot/initrd.img
}
submenu 'Troubleshooting -->' {
	menuentry 'Install AlmaLinux 10.0 in basic graphics mode' --class fedora --class gnu-linux --class gnu --class os {
		linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=AlmaLinux-10-0-x86_64-dvd nomodeset quiet
		initrdefi /images/pxeboot/initrd.img
	}
	menuentry 'Rescue an AlmaLinux system' --class fedora --class gnu-linux --class gnu --class os {
		linuxefi /images/pxeboot/vmlinuz inst.stage2=hd:LABEL=AlmaLinux-10-0-x86_64-dvd inst.rescue quiet
		initrdefi /images/pxeboot/initrd.img
	}
}
```

The guide says to make sure the path to the drive is properly linked, which it is. It continues on to much more but it get very CentOS specific, so I'm veering away. its possible this is befcause of issues with the RHEL efi bootloader, and if that were the case, I could replace the native apple bootloader with something that can handle most uefi bootloaders, like rEFInd. I don't know why i didnt have this issue with arch linux, but if it works with refind than i know it must be because of the bootloader. rEFInd is a boot manager that can be installed on macs and other computers to make booting multiple OSes easier. Its instilation is a little technical, but the guide is pretty good.

After installing rEFInd, it saw multiple sections of the USB drive: Boot EFU\BOOT\grubx64.efi from AlmaLinux-10-0-x86_64-dvd, Boot EFU\BOOT\grubx64.efi from AlmaLinux-10-0-x86_64-dvd and unfortunately I found i could not boot into a single one of them. There is definitely some problem with this instilation that is causing it not to run on this hardware. This is the newest version of alma linux, it came out only a few months ago, so its hard to find specific information about it. Worth downgradging to alma 9 anyway. Best to try it out.

Good news is alma 9 booted right up. So safe to use it as a baseline.

## Installing Alma Linux 9

First it asks the basic questions, language, keyboard layout, and time zone.

Then it asks what the source of the installation will be. My ISO was freshly burned onto the USB drive, so I selected local media. For Software Selection, Im going to select Minimal Install, so that I can add only the packages I want later. Most of these servers will be running headless, so I don't need a desktop environment. 

I decided the best way to deal with my hard drive because it had been partitioned into a thousand pieces from previous installs, was to just make a gParted live USB and use that to wipe the drive, so the only thing on the hard drive is rEFInd. I booted into the alma 9 installer again, then went through the instilation process.

During the installation, I set the computer to custom partitioning, set a swap partition matching my RAM, boot partition of 1GB, a system partition of 70mb, a home partition of 16gb for only local files, and the rest of the drive as a shared data partition. on this machine that ende dup in 352 GB of shared storage.

Then i needed network access. I need a usb hub.