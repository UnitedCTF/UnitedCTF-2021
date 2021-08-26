all:
	go build main.go
	mv main stringsstrings
	perl -pi -e 's/UnitedCTF-2021\/UnitedCTF-2021/FLAG-9190JA39AN2VMA0221NA99RM/g' stringsstrings
	echo "The following line must find the flag that's in the binary:"
	strings stringsstrings | grep FLAG-9190JA39AN2VMA0221NA99RM
