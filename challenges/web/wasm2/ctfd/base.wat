(module
    (memory (import "js" "memory") 1)
    
    (func $put_challenge (import "imports" "put_challenge") (param i32))
    (func $verify_answer (import "imports" "verify_answer") (param i32))

    (func (export "main")
        
    )
)