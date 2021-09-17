# 3. Coding Interview

We're impressed so far. Time to prove your worth one last time.

A while back we managed to get our hands on a "language detector" and had a good laugh at their algorithm.\
Anyway, we extracted the c++ one and sent it to you. Good luck!

- **Max chars:** *32*
- **Threshold:** *64k iterations*
- [Regex File](https://github.com/UnitedCTF/UnitedCTF-2021/new/redos-oli/challenges/programming/redos/src/challenge3.py)

## WriteUp

The redos is a bit harder to find on this one, it's `(?(lib)[A-z =]*|[0-9])+`.\
To abuse it, the group named **lib** must exist and then it's easy as spamming letters, spaces and equals then ending the string with something that won't match (in my case, a number)\
The **import_statement** has absolutely no use at all.\
The **lib** must be an *m* followed by any lowercase letter followed by *lloc*. One could technically write `mzlloc`.

## Solution
`#import malloc; int flag = 1337`

## Flag
`FLAG-AlwaysPepperSomeMallocHereAndThere`
