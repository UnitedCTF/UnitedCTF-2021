# 2. Email Validation

Now that you understand the basics of a redos, let's start you on your next trial.

One of us used to work in a company that wanted to cook their own email validation regex. Being as concerned about the quality of their code as they were, they gave the task to a first year intern.\
It may not be the safest regex but damn, first time I see good documentation on one.

*Tip: If you need help decoding a regex, websites such as [regexr](www.regexr.com) do a great job at explaining what each part does.*

- **Max chars:** *32*
- **Threshold:** *40k iterations*
- [Regex File](https://github.com/UnitedCTF/UnitedCTF-2021/new/redos-oli/challenges/programming/redos/src/challenge2.py)

## WriteUp

The catch is that, in the **higherLevelDomains** group, the dot isn't escaped, which means that it ends up being a `(.\w+)+` which you can abuse by putting as much alphanumeric chars as you want.
If you put anything else than an alphanumeric char, it significantly reduces the number of iterations since it can only be matched by the dot instead of having thousands of possibilities like we want with a redos.
The last exclamation mark is there to make sure it doesn't shortcircuits a match. Since it's not followed by an alphanumerical character it will be matched by the dot but not the \w (which is needed because of the +).

Bonus:\
The "followingWord" group is there to show how to escape the dot in a regex.

## Solution
`united.ctf@xXHaxorzPwnz1337Xx!`

## Flag
`FLAG-EmailAddressesAreHard`
