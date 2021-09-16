(module
    (memory (import "js" "memory") 1)
    
    (func $put_challenge (import "imports" "put_challenge") (param i32))
    (func $verify_answer (import "imports" "verify_answer") (param i32))

    ;; ====== START OF WASM STUDIO ======
    (type $t2 (func (param i32)))
    
    (func $reverse_string (export "reverse_string") (type $t2) (param $p0 i32)
        (local $l0 i32)
        get_local $p0
        i32.load8_u
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=35
        i32.store8
        get_local $p0
        get_local $l0
        i32.store8 offset=35
        get_local $p0
        i32.load8_u offset=1
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=34
        i32.store8 offset=1
        get_local $p0
        get_local $l0
        i32.store8 offset=34
        get_local $p0
        i32.load8_u offset=2
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=33
        i32.store8 offset=2
        get_local $p0
        get_local $l0
        i32.store8 offset=33
        get_local $p0
        i32.load8_u offset=3
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=32
        i32.store8 offset=3
        get_local $p0
        get_local $l0
        i32.store8 offset=32
        get_local $p0
        i32.load8_u offset=4
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=31
        i32.store8 offset=4
        get_local $p0
        get_local $l0
        i32.store8 offset=31
        get_local $p0
        i32.load8_u offset=5
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=30
        i32.store8 offset=5
        get_local $p0
        get_local $l0
        i32.store8 offset=30
        get_local $p0
        i32.load8_u offset=6
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=29
        i32.store8 offset=6
        get_local $p0
        get_local $l0
        i32.store8 offset=29
        get_local $p0
        i32.load8_u offset=7
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=28
        i32.store8 offset=7
        get_local $p0
        get_local $l0
        i32.store8 offset=28
        get_local $p0
        i32.load8_u offset=8
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=27
        i32.store8 offset=8
        get_local $p0
        get_local $l0
        i32.store8 offset=27
        get_local $p0
        i32.load8_u offset=9
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=26
        i32.store8 offset=9
        get_local $p0
        get_local $l0
        i32.store8 offset=26
        get_local $p0
        i32.load8_u offset=10
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=25
        i32.store8 offset=10
        get_local $p0
        get_local $l0
        i32.store8 offset=25
        get_local $p0
        i32.load8_u offset=11
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=24
        i32.store8 offset=11
        get_local $p0
        get_local $l0
        i32.store8 offset=24
        get_local $p0
        i32.load8_u offset=12
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=23
        i32.store8 offset=12
        get_local $p0
        get_local $l0
        i32.store8 offset=23
        get_local $p0
        i32.load8_u offset=13
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=22
        i32.store8 offset=13
        get_local $p0
        get_local $l0
        i32.store8 offset=22
        get_local $p0
        i32.load8_u offset=14
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=21
        i32.store8 offset=14
        get_local $p0
        get_local $l0
        i32.store8 offset=21
        get_local $p0
        i32.load8_u offset=15
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=20
        i32.store8 offset=15
        get_local $p0
        get_local $l0
        i32.store8 offset=20
        get_local $p0
        i32.load8_u offset=16
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=19
        i32.store8 offset=16
        get_local $p0
        get_local $l0
        i32.store8 offset=19
        get_local $p0
        i32.load8_u offset=17
        set_local $l0
        get_local $p0
        get_local $p0
        i32.load8_u offset=18
        i32.store8 offset=17
        get_local $p0
        get_local $l0
        i32.store8 offset=18
    )
    ;; ====== END OF WASM STUDIO ======

    (func (export "main")
        (call $put_challenge
            (i32.const 1337)
        )

        (call $reverse_string
            (i32.const 1337)
        )

        (call $verify_answer
            (i32.const 1337)
        )
    )
)