# codedump writeup

The static analysis could be challenging for the participants as the code has been written in assembly so decompilers like Ghidra doesn't give a good representation of C code equivalent. As you might guessed it, this writeup have been done using dynamic analysis with x32dbg debugger. Participants can use Ghidra in disassembly view to follow the code during dynamic analysis.

First the code is using a call$+4/pop getPc technique in order to retrieve the value of eip. When the value of eip is retrieved, the shellcode use it with the offset `0xE` to point somwhere in the code. The somewhere is where we have an encoded shellcode and so the later is decoded at runtime using the xor operator and the key `0xA9B4A1D7`.

![image_call](/screenshots/0.png)
![image_pop](/screenshots/1.png)

When that is done, the code goes to the new decoded shellcode and we have this : 
![image_peb_accessed](/screenshots/2.png)

The framed stuff is the access to the Process Environment Block (PEB). It used to access to the PEB_LDR_DATA structure and then to the LDR MODULE. With that we can access to the loaded dlls' base address. More info : https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/api/pebteb/peb/index.htm

With that done the shellcode retrieve the address of kernel32.dll using its export table (with the help of the name table, the ordinal table and the address table) in order to call loadLibrary with the argument "urlmon.dll".

![image_call_loadLibrary](/screenshots/3.png)


Then the shellcode keep the base address of urlmon.dll in order to call its export function `URLDownloadToFileA`. One of the parameter of the function is decoded using a rolling xor algorithm and the decoded string is the flag that should be the URL passed to `URLDownloadToFileA`. An other parameter is the file `fake.exe` but it is not important for the challenge.

Rolling XOR algorithm : ![image_rolling_xor](/screenshots/4.png)

Call to `URLDownloadA` : ![image_urldownload](/screenshots/5.png)

And so the Flag is : `FLAG-ImAnIndicatorOfCompromise`

As the URLDownload won't be able to reach the URL, the shellcode will continue by calling the function `ExitProcess`.

![image_exitprocess](/screenshots/6.png)

