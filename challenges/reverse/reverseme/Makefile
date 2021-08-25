default:
	nasm -f bin boot.asm -o boot.bin

boot:
	qemu-system-x86_64 \
		-drive file=boot.bin,format=raw,if=floppy

debug:
	qemu-system-x86_64 -S -s \
			-drive file=boot.bin,format=raw &
	gdb -nh \
		-ex "target remote localhost:1234" \
		-ex "set architecture i8086" \
		-ex "break *0x7c00"

clean:
	rm boot.bin