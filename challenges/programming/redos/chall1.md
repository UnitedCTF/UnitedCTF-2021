# 1. Introduction to Redos

Hi and congratz on getting the job. Even though we like you and your skillset, we must make sure that you're able to learn enough for this.\
It's going to be pretty easy, we give you 3 trials of increasing difficulty then the real deal.

You job is to craft a Redos attack, don't worry we reproduced the environment localy so you don't have any risk of getting caught while crafting your payload.\
The first trial is extremely basic but I still suggest you read a bit on the subject before going in.

You can enter a maximum of 8 characters and need to achieve 2000 steps. Every trial also comes with the file used to validate the regex. Good luck!

- **Max chars:** *8*
- **Threshold:** *2000 iterations*
- [Regex File](https://github.com/UnitedCTF/UnitedCTF-2021/new/redos-oli/challenges/programming/redos/src/challenge1.py)

## WriteUp

To abuse a redos, we need to find a double group repetition. The next step is to make that "double group" as long as we can, every char about doubles the number of steps.\
Then we need to make sure that the regex doesn't shortcircuit, which happens when the engine already knows that it either matches or doesn't.

For this one challenge the formula looks a bit like this:
- 16 base iterations (whatever the word is)
- multiplied by 2^n, where n is the number of chars matched by \w before the first one that doesn't match.
- substract 3 steps for whatever reason

So we can easily see that ever character counts when exploting a redos. For example if we had 16 chars instead of 8, the max would be 524 285 instead of 2045.\
The solution is simply to put 7 alphanumerical chars then anything else.

## Solution
`Hi_nerd!`

## Flag
`FLAG-BabysFirstRedos`
