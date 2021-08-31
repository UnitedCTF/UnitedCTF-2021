#!/bin/bash
# DO NOT RUN WITH 'set -e'

if [ "$EUID" != 0 ]; then
  echo "Re-running this script as root"
  sudo $0 "$@"
  exit $?
fi

# Create a 64M file
dd if=/dev/random of=openme bs=1048576 count=64

# Format the file to contain 2 partitions
fdisk openme <<END
g
n


+16M
n



w

END

# Create a temporary directory to mount our partitions
TMPD=$(mktemp -d tmp.XXXXXX)
# Reserve a loop device
LOOP=$(losetup -f)
# Mount the image as a loop device with partitions
losetup -P "$LOOP" openme || exit 1

# Format the first partition as FAT32
mkfs.fat -F32 -n OPENME "${LOOP}p1"

# Mount the first partition and put the secret in it
mount "${LOOP}p1" "$TMPD"
echo "This is not a flag, but your efforts are rewarded! The password is 'iloveyou' if you were looking for one (or maybe you'll need it later)." > "$TMPD/README"
umount "$TMPD"

# Format the second partition as LUKS
echo "iloveyou" | cryptsetup luksFormat "${LOOP}p2"
echo "iloveyou" | cryptsetup luksOpen "${LOOP}p2" openme

# Add LVM partitions in the second partition
pvcreate /dev/mapper/openme
vgcreate vg-openme /dev/mapper/openme
lvcreate -Zn -l 100%FREE -n lv-openme vg-openme

# Fix missing symlinks in WSL2
[ ! -b "/dev/vg-openme/lv-openme" ] && vgscan --mknodes

# Format the first LV as EXT4
mkfs.ext4 -L OPENME "/dev/vg-openme/lv-openme"

# Mount the LV in the second partition and put the flag in it
mount "/dev/vg-openme/lv-openme" "$TMPD"
echo "FLAG-DOWN_THE_RABBIT_HOLE" > "$TMPD/flag.txt"
umount "$TMPD"

# Desactivate the VG
vgchange -an vg-openme

# Fix un-missing symlinks in WSL2
[ -e "/dev/vg-openme/lv-openme" ] && vgscan --mknodes

# Close the LUKS partition
cryptsetup luksClose "/dev/mapper/openme"

# Close the loop device
losetup -d "$LOOP"

# Remove the temporary directory
rmdir "$TMPD"

# Make the file readable without root if invoked with sudo
[ ! -z "$SUDO_USER" ] && \
  chown $SUDO_USER:$SUDO_GID openme
