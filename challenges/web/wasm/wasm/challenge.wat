(module
    (func $too_slow (import "imports" "too_slow"))

    (memory 1)

    (func $str_len (param $offset i32) (result i32)
        (local $i i32)
        (local.set $i (local.get $offset))

        (block
            (loop
                (br_if 1 
                    (i32.eq
                        (i32.load8_u (local.get $i)) 
                        (i32.const 0)
                    )
                )
        
                (local.set $i 
                    (i32.add (local.get $i) (i32.const 1))
                )

                (br 0)
            )
        )

        (i32.sub (local.get $i) (local.get $offset))
    )

    (func (export "main")
        (local $i i32)
        (local $set i32)
        (local $offset i32)
        (local $key i32)
        (local $key_len i32)
        (local $enc i32)
        (local $enc_len i32)

        (local.set $offset (i32.const 1337))

        (local.set $key_len 
            (call $str_len
                (local.get $key)
            )
        )

        (local.set $enc 
            (i32.add (i32.add (local.get $key) (local.get $key_len)) (i32.const 1))
        )

        (local.set $enc_len 
            (call $str_len
                (local.get $enc)
            )
        )

        (block $block_loop
            (loop $loop
                (if 
                    (i32.eqz (local.get $set))
                    (then
                        (i32.store8
                            (i32.add (local.get $i) (local.get $offset))
                            (i32.xor
                                (i32.sub 
                                    (i32.load8_u 
                                        (i32.add (local.get $enc) (local.get $i))
                                    )
                                    (i32.const 1)
                                )
                                (i32.load8_u
                                    (i32.add 
                                        (local.get $key) 
                                        (i32.sub 
                                            (i32.sub (local.get $key_len) (i32.const 1))
                                            (i32.rem_u (local.get $i) (local.get $key_len))
                                        )
                                    )
                                )
                            )
                        )
                    )
                    (else
                        (i32.store8
                            (i32.add (local.get $i) (local.get $offset))
                            (i32.const 0)
                        )
                    )
                )

                (local.set $i (i32.add (local.get $i) (i32.const 1)))

                (if 
                    (i32.eq (local.get $i) (local.get $enc_len))
                    (then
                        (if 
                            (i32.eqz (local.get $set))
                            (then
                                (local.set $i (i32.const 0))
                                (local.set $set (i32.const 1))
                            )
                            (else
                                (br $block_loop)
                            )
                        )
                    )
                )

                (br $loop)
            )
        )

        (call $too_slow)
    )

    (data (i32.const 0) "DATA")
)