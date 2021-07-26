(module
    (memory (import "js" "memory") 1)
    (func $put_challenge (import "imports" "put_challenge") (param i32))
    (func $verify_answer (import "imports" "verify_answer") (param i32))
  
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
        (local $c_len i32)

        (local $offset i32)
        (local.set $offset (i32.const 1337))

        (call $put_challenge
            (i32.const 0)
        )

        (local.set $c_len 
            (call $str_len
                (i32.const 0)
            )
        )

        (block $block
            (loop $loop
                (i32.store8 
                    (i32.add (local.get $offset) (local.get $i))
                    (i32.load8_u
                        (i32.sub (i32.sub (local.get $c_len) (i32.const 1)) (local.get $i))
                    )
                )

                (local.set $i (i32.add (local.get $i) (i32.const 1)))

                (br_if $block (i32.eq (local.get $i) (local.get $c_len)))
                
                (br $loop)
            )
        )

        (call $verify_answer
            (local.get $offset)
        )
    )
)