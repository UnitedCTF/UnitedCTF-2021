# CTFLang

`CTFLang` is a two-dimensional stack-based multiprogramming language similar to `Befunge`. The language was designed to be alot like a 2D-ASCII game, with multiple "characters" roaming around a "map". This makes `CTFLang` very unpredictable and full of race conditions...

## Program Counter (PC)

A PC `@` in `CTFLang` is a compound datastructure defined as follows.

```
class PC:
    alive: bool = True
    position: Tuple[int, int]
    direction: Union['Left', 'Right', 'Up', 'Down'] = 'Right'
    stack: List[int] = []
```

Each program step, every PC on the grid move one unit in their internal direction state, with precedence on earlier generated PCs.

## Operators

Operators are all non-PC characters on the grid. They perform operations using the PCs that lands on them, which can include the following. 

- Change the PC's alive state.
- Change the PC's direction state.
- Change the PC's stack.
- Change global states (stdout and map).

The following table lists all the operators and their basic functionality. More complex operators are provided a seperate section.

| OP    | Description                                                                  |
| ----- | ---------------------------------------------------------------------------- |
| `A-Z` | Alpha-Push: Push ASCII value to PC stack                                     |
| `0-9` | Num-Push: Push ASCII value to PC stack                                       |
| `?`   | Space-Push: Push ASCII space (0x20) to PC stack                              |
| `<`   | Left: Set PC direction to `Left`                                             |
| `^`   | Up: Set PC direction to `Up`                                                 |
| `v`   | Down: Set PC direction to `Down`                                             |
| `>`   | Right: Set PC direction to `Right`                                           |
| `#`   | Flag: Set PC `alive = False`, stopping execution                             |
| `+`   | Addition: Pop two PC stack values `a` and `b`, then push `a + b`             |
| `-`   | Substraction: Pop two PC stack values `a` and `b`, then push `b - a`         |
| `$`   | Copy: Pop PC stack value `a`, then push `aa`                                 |
| `.`   | Print: Pop PC stack value `a`, then print `a` to stdout                      |
| `,`   | Input: Get character input `a` from stdin, then push `a` to PC stack         |
| `!`   | Delete: Pop PC stack value `a`, then discard value                           |
| `_`   | Drop: Pop PC stack value `a`, then place `a` on the grid                     |
| `=`   | Equal: Peek two PC stack values `a` and `b`, if `a == b`, skip next slot     |
|       | Nop: If the operator is not defined, do nothing                              |

### Equal Operator

The equal operator peeks two the PC stack and checks if they are equal. There are 2 possibilities:

1) If the values are equal, skip over the next slot.

Initial State
```
@=12
```
```
PC1: [A, A], Right
```

Post-Equal
```
 =1@
```
```
PC1: [2, A, A], Right
```

2) If the values are not equal, do not skip the next slot.

Initial State
```
@=12#
```
```
PC1: [A, B], Right
```

Post-Equal
```
 =@2#
```
```
PC1: [1, A, B], Right
```

### Drop Operator

The drop operator pops the PC stack and sets itself to the value. There are 3 possibilities:

1) If the dropped value is a push operator (`A-Z`, `0-9`, or `?`), the grid location returns to the drop state once collected.

Initial State
```
@ @ _   #
```
```
PC1: [], Right
PC2: [A], Right
```

PC2 drops `A`
```
   @A@  #
```
```
PC1: [], Right
PC2: [], Right
```

PC1 collects `A` and resets the drop
```
    _@ @#
```
```
PC1: [A], Right
PC2: [], Right
```

2) If the dropped value is any other operator, the grid location will behave like the operator.

Initial State
```
@ @ _   #

    #
```
```
PC1: [], Right
PC2: [v], Right
```

PC2 drops `v`
```
   @v@  #

    #
```
```
PC1: [], Right
PC2: [], Right
```

PC1 redirected by `v`
```
    v  @#
    @
    #
```
```
PC1: [], Down
PC2: [], Right
```

3) If the dropped value is `@`, a copy of the PC is made and the direction is set to `Right`.

Initial State
```
@v
 _ #
 
 #
```
```
PC1: [@, A, B, C], Right
```

Post-Drop
```
 v
 _@#
 @
 #
```
```
PC1: [A, B, C], Down
PC2: [A, B, C], Right
```
