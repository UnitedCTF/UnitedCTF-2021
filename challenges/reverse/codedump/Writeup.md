# codedump writeup

The static analysis could be challenging for the participants as the code has been written in assembly so decompilers like Ghidra doesn't give a good representation of C code equivalent. As you might have guessed, this writeup has been done using dynamic analysis with x32dbg debugger. Participants can use Ghidra in disassembly view to follow the code during dynamic analysis.

First the code is using a call$+4/pop getPc technique in order to retrieve the value of eip. When the value of eip is retrieved, the shellcode use it with the offset `0xE` to point somwhere in the code. The somewhere is where we have an encoded shellcode and so the later is decoded at runtime using the xor operator and the key `0xA9B4A1D7`.

![image_call](https://user-images.githubusercontent.com/43150719/133357954-ed1e2ed9-4b0c-4de0-b63e-bceb0008fef2.png)
![image_pop](https://user-images.githubusercontent.com/43150719/133358013-af887d2c-bf65-4ed4-86fc-88c584c69dac.png)

When that is done, the code goes to the new decoded shellcode and we have this : 
![image_peb_accessed](https://user-images.githubusercontent.com/43150719/133358029-c964079e-8218-4073-90e8-8e2a83efeaa2.png)

The framed stuff is the access to the Process Environment Block (PEB). It used to access to the PEB_LDR_DATA structure and then to the LDR MODULE. With that we can access to the loaded dlls' base address. More info : https://www.geoffchappell.com/studies/windows/km/ntoskrnl/inc/api/pebteb/peb/index.htm

With that done the shellcode retrieve the address of kernel32.dll using its export table (with the help of the name table, the ordinal table and the address table) in order to call loadLibrary with the argument "urlmon.dll".

![image_call_loadLibrary](https://user-images.githubusercontent.com/43150719/133358117-0b3562bb-b07a-4c00-adc6-9cab756a3c75.png)


Then the shellcode keep the base address of urlmon.dll in order to call its export function `URLDownloadToFileA`. One of the parameter of the function is decoded using a rolling xor algorithm and the decoded string is the flag that should be the URL passed to `URLDownloadToFileA`. An other parameter is the file `fake.exe` but it is not important for the challenge.

Rolling XOR algorithm : ![image_rolling_xor](https://user-images.githubusercontent.com/43150719/133358139-c3627b9d-6a85-43e3-bbe5-39a8eec65823.png)

Call to `URLDownloadA` : ![image_urldownload](https://user-images.githubusercontent.com/43150719/133358158-df484c2d-00a6-4f57-b9d4-1092e5a767b6.png)

And so the Flag is : `FLAG-ImAnIndicatorOfCompromise`

As the URLDownload function won't be able to reach the URL, the shellcode will continue by calling the function `ExitProcess`.

![image_exitprocess](https://user-images.githubusercontent.com/43150719/133358194-72f1f717-fa28-4830-9e54-9d314ab68790.png)

