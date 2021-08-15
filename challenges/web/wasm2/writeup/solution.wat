(module
    (memory (import "js" "memory") 1)
    (func $put_challenge (import "imports" "put_challenge") (param i32))
    (func $verify_answer (import "imports" "verify_answer") (param i32))

  	(func (export "main")
        (local $i i32)

        (call $put_challenge
            (i32.const 0)
        )

        (block $block
            (loop $loop
                ;; Copy mem[35 - $i] to mem[1337 + $i] 
                (i32.store8 
                    (i32.add 
                        (i32.const 1337) 
                        (local.get $i)
                    )
                    (i32.load8_u
                        (i32.sub 
                            (i32.const 35) 
                            (local.get $i)
                        )
                    )
                )

                ;; $i++
                (local.set $i (i32.add (local.get $i) (i32.const 1)))

                ;; break if i == 36
                (br_if $block (i32.eq (local.get $i) (i32.const 36)))
                
                (br $loop)
            )
        )

        (call $verify_answer
            (i32.const 1337)
        )
    )
)