default:
	nasm -f bin boot.asm -o boot.bin

hint:
	python ./tools/shuffle_chars.py

	mv chars.asm _chars.asm
	mv chars_shuffled.asm chars.asm

	nasm -f bin boot.asm -o boot.bin

	mv _chars.asm chars.asm

final:
	python ./tools/shuffle_chars.py
	
	mv flag.asm _flag.asm
	echo 'FLAG: ' > flag.asm

	mv chars.asm _chars.asm
	mv chars_shuffled.asm chars.asm

	nasm -f bin boot.asm -o boot.bin

	mv _chars.asm chars.asm
	mv _flag.asm flag.asm

	python ./tools/scramble_end.py

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
