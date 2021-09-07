# 1. Introduction to Redos

- **Max chars:** *8*
- **Threshold:** *2000 iterations*
- [Regex File](https://github.com/UnitedCTF/UnitedCTF-2021/new/redos-oli/challenges/programming/redos/src/challenge1.py)

## WriteUp

To abuse a redos, we need to find a double group repetition. The next step is to make that "double group" as long as we can, every char about doubles the number of steps.\
Then we need to make sure that the regex doesn't shortcircuit, which happens when the engine already knows that it either matches or doesn't.

For this one challenge the formula looks a bit like this:
- 16 base iterations (whatever the word is)
- multiplied by 2^n, where n is the number of chars matched by \w before the first one it doesn't match.
- substract 3 steps for whatever reason

So we can easily see that ever character counts when exploting a redos. For example if we had 16 chars instead of 8, the max would be 524 285 instead of 2045.\
The solution is simply to put 7 alphanumerical chars then anything else.

## Solution
`Hi_nerd!`

## Flag
`FLAG-BabysFirstRedos`
