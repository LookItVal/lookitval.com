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

During the installation, I set the computer to custom partitioning, set a swap partition matching my RAM, boot partition of 1GB, a root partition of 70gb, a home partition of 16gb for only local files, and the rest of the drive as a shared data partition. on this machine that ended up in 352 GB of shared storage.

Then i needed network access. I need a usb hub. so I got one.

Alma linux normally asks for your network connection during the installation, and helps you set it up. I'm not going to connect this machine to a switch or router with a hardlined connection until later, so I need to set up wifi, and I will not set a static IP address in the begining. I will set up a static IP address later, once I add a switch to the system and put this machine on a hardlined connection. For now I will connect with Ethernet over USB using my phone. Using something called "USB Tethering", I can share my phones internet connection with the computer over USB. I find this to be one of the most effective ways to give internet to a computer during installation, before you have the proper drivers installed for your wifi card. I have done this many times before, and it works great.

So i partitioned the drive using an LVM, i stuck with the existing boot loader on the drive, which is rEFInd. I made a swap partition thats the size of my ram, a boot partition of 1GB, a root partition of 64GB, a home partition of 16GB, and the rest of the drive as a shared data partition. That shared data partition ended up being 358GB. The fact that this is an LVM means that I can resize these partitions later if I need to however.

For the network I went ahead and gave this machine a hostname of "manager1", since this will serve as the initial management node for the homelab for some time. Right now its connected using DHCP over the USB tethering, but later I will set up a static IP address once I have a switch and router in place.

I set the root password to something secure, and created an admin user with sudo privileges, and then I let the installation run.

It did warn me that it could not find the package mactel-boot, which is a package that helps macs boot properly. I think this is because this is an old macbook pro, and the package is not compatible with this version of alma linux. I am going to ignore this warning for now, since i told it not do install the bootloader, and rEFInd should be able to handle it.

To my surprise, refind was in fact not able to handle it. When I rebooted, the OS did not show up in the rEFInd menu. I booted back into the live alma linux USB drive, and confirmed that the OS was present, but the boot loader seems to not be able to find it.

This may be because of the LVM partitioning scheme, so im going to try and open up the rEFInd config file and add the OS manually. The config file is located at `/boot/efi/EFI/refind/refind.conf`, but i dont actually have an operating system i can boot into yet, so I need a bootable OS I can use to edit this file. gParted could probably do it, but I also have an arch linux live USB drive here I can use. I booted into that, mounted the efi partition, and opened up the config file in vim.

This may feel excessive but these 3 drives if kept around will be incredibly useful for troubleshooting and fixing problems in the server. Between these 3 drives I can control almost anything about the system without an installed OS.

When running `fdisk -l` I can see that there is an efi partition at `/dev/sda1` for refind, and the boot partition for alma linux is at `/dev/sda2`, and the rest of the partitions are in an LVM group. rEFInd should be able to see the OS, but either way i will continue on.

I am going to mount the EFI partition, then open up the refind config file located at `/mnt/EFI/refind/refind.conf`. At the bottom of the file I added the following menu item:

```
menuentry "AlmaLinux 9" {
    volume /dev/sda2 # The location of the boot partition
		loader /vmlinuz-<version> # The location of the kernel
		initrd /initramfs-<version>.img # The location of the initramfs
		options "ro root=/dev/mapper/almalinux-root rhgb quiet" # The root partition and any kernel options
}
```

The only thing is we have to find the version of our kernel, which we can do by looking in the boot partition. It should be in a file named something like `vmlinuz-<version>` in the root of the boot partition. I found mine to be `vmlinuz-5.14.0-570.12.1.e19_6.x86_64`, and the initramfs to be `initramfs-5.14.0-570.12.1.e19_6.x86_64.img`. So the final menu entry looks like this:

```
menuentry "AlmaLinux 9" {
		volume /dev/sda2
		loader /vmlinuz-5.14.0-570.12.1.e19_6.x86_64
		initrd /initramfs-5.14.0-570.12.1.e19_6.x86_64.img
		options "ro root=/dev/mapper/almalinux-root rhgb quiet"
}
```

From there I rebooted and rEFInd was able to see the OS but when i booted into it, it told me it could not find the loader file. So i booted back into arch and checked the boot partition and make sure i listed the correct path. Sure enough, the kernel version didnt actally say `e19_6`, it said `el9_6`. So I fixed that in the config file, rebooted, and this time it worked. Just kidding it told me.

```log
Invalid loader file!
Error: Not found while loading vmlinuz-5.14.0-570.12.1.el9_6.x86_64
```

Lets Take a closer look at this boot name again. Im like 99.9% sure the file names match. Except that the volume is wrong. Its not `/dev/sda2`, its actually the uuid of that drive. you can find that with `blkid /dev/sda2`. So I changed the volume line to that value and rebooted. Didnt work. So tried giving it a label and using that. Still didnt work. So I suspect refind has an issue with XFS partitions. Lets double check thats whats on the boot partition, and if that is the case, then I will reformat the boot partition to ext4. `blkid /dev/sda2` shows that it is in fact XFS. I am going to copy all the files off the boot partition, reformat it to ext4, then copy the files back.

```bash
mount /dev/mapper/almalinux-data /mnt
mount --mkdir /dev/sda2 /mnt/boot
cp -r /mnt/boot/* /mnt/backup
umount /mnt/boot
mkfs.ext4 /dev/sda2
mount --mkdir /dev/sda2 /mnt/boot
cp -r /mnt/backup/* /mnt/boot
```

After doing that, I rebooted. rEFInd was able to see the OS, seperate from the manual entry i added. the manual entry i added now loads, but did not run. The new entry got me into the OS, and tried to boot and got very close, but it still failed. It got failed trying to switch root.

Going to try and completely burn this hard drive to the ground and recover its original boot loader, and try and use that. The thing that is a little concerning is the mac boot loader does not seem to be able to open the alma 9 boot disk, so I am not sure if it will be able to open the alma 9 instilation on the hard drive. But its worth a try.

As suspected, The Alma 9 Boot disk also does not work with the mac boot loader. So I am going to try and install Alma 8. That means flashing yet another USB drive. This is getting ridiculous.

Alma 8 had no issues booting from the mac boot loader. So I went through the instilation process again, using the same settings. same warrning popped up about missing packages: mactel-boot, but I ignored it again. In the end it was not able to boot either, but at least i could go back into the live usb.

One more try, this time manually telling it to make the boot drive ext4. That wasnt it.

This time I completely wiped the drive, added a new partition for the efi system manually, and then went through the alma 8 instalation process again, telling it to use the efi partition i made. Once it finished installing i am going to try chroot into it from the arch usb and make sure grub is set up properly.

### New Day: New Plan

The new plan is simple in premise: 
1. wipe the drive completely. no EFI system partition no nothing.
2. Within gParted, added the new EFI system partition. We will give it the `ESP` flag and make sure its labeled, and set it to FAT32. 
3. Install Alma 8 from the bootable media. Tell alma to mount that efi system partition at /boot/efi. Tell alma not to install the boot loader.
4. Reboot and open the Alma 8 bootable media again, open with the Troubleshooting flag and open the rescue environment
5. chroot into the newly installed system. There there should be a partition mounted at /boot and /boot/efi.
6. manually make sure the grub configuration files are setup.

Grub will successfully boot through this same mac for sure, because when i set it up with the command line on arch there was no issue. The key here is using the alma environment to chroot into the system, that was the biggest thing i did not do yesterday. so lets begin.

1. Burn the drive to the ground. I am going to do this at the same time as the next step
2. in gParted, make the EFI System Partition and flag it ESP.
3. Install alma 8. Do not install the boot loader.
4. Reboot alma 8 in the Rescue Environment
5. I found the /boot/efi partition was not mounted so i mounted it
redoing `grub2-mkconfig -o /boot/efi/EFI/almalinux/grub.cfg` was at least enough to get grub to at least load something, but it did eventually fail to switch to the root.

I can not do this now but what I would like to do when I am home is
1. Burn the HD to the ground. Completely. Do not recycle the existing ESP
2. Make a new EFI System Partition. `ESP` flag and all.
3. Connect to Ethernet
4. Install Alma 8. Do not install a boot loader, but do set the boot location. Do set static IP connection.
5. Reboot in the rescue environment
6. Mount all needed drives, update dnf and install needed packages. reinstall grub2.
7. `grub2-mkconfig -o /boot/efi/EFI/almalinux/grub.cfg`
8. reboot into HD grub
9. remove any lingering unneeded boot options?