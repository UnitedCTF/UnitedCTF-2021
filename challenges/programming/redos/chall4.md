# 4. The Real Challenge

You've done it! You may be our only chance of success. \
Our target is a major service company, the less you know the better trust me. They're doing millions of regex validations per day and all we need is a few seconds of downtime.

They've got a decent protection so a dumb DDoS won't cut it but a decent REDoS mixed with a distributed attack might be what we're looking for. \
Anyway, here's the threshold we estimated and the leaked regex file as usual.

- **Max chars**: *40*
- **Threshold:** *11.5m iterations*
- [Regex File](https://github.com/UnitedCTF/UnitedCTF-2021/new/redos-oli/challenges/programming/redos/src/challenge4.py)

## WriteUp

I had so much fun doing this one. It's a great mix of the worst thing one can do with a modern regex engine.

First of all, let's dissamble the regex.

1. `(?P<a5>\\S)`: **Group a5**, matches anything that isn't a white space or the empty string.
2. `(?P<a14>(?<!(?(a5)[\\w\\W]|.)))`: **Group a14**, never matches (see below for more details)
3. `(?P<a23> )`: **Group a23**, matches a literal space
4. `(?P<a35>\\s)`: **Group a35**, matches any whitespace
5. `(...){{{c % 16}}}`: Matches any of one of the groups inside n times, where n is equal to *c % 16*
6. `(?(a14)\\w+|(?P=a23))`: Matches either 1 or more alphanumeric character if **a14** exists, else matches **a23**
7. `(?(a{b})(?P=a{a})+|(...)))`: Matches either 1 or more occurence of **a{a}** if **a{b}** exists, else matches *step 6*
8. `(?(a{c})(...)|_)`: Matches either *step 7* if **a{c}** exists, else matches a literal underscore.

*Group a14 explanation:*\
a14 will only match if the precondition doesn't match but the condition is always true. If a5 preexists, it will match anything that isn't an empty string ([\w\W]) else it's a dot.\
Since a5 needs to exists to branch to the first group, we know it will never have only an empty string right before.

The redos is split in 2 parts. The first one is about matching the right groups. It's not to hard to decide which ones need to be matched since **a14** can't exist.\
The second part is the actual vulnerability. More precisely it's in the *true* branch of *step 7*.\
To get there **a{a}**, **a{b}** and **a{c}** must all exist.

Time to determine which variable is which group. First, we can't easily assign **a35** to *c* since the length of the message must be the biggest one. The message must be exactly 35 chars in length.

Next, both **a5** and **a23** could be assigned to either *a* or *b*. The trick is realising that the underscore (which needs to exists to find *b*) marks the end of the actual attack string.\
Since the vulnerable part is basically `(a{a}+)+`, it needs either a non-whitespace character or a literal space, both possibilities don't include the underscore which is considered a whitespace.\
Once python hits the underscore, it will stop it's current NFA path, so less characters before the underscore means less paths to go through. This means that b must be assigned to **a23** and a is **a5**.

This gives our current set of rules:
- 35 characters
- underscore as the 24th char 
- The sum of every ascii value modulo 35 must be equal to 5 (not that hard, only scary)

Since *c* must be equal to 35, we also know that *step 5* will match 3 times only, the 3 groups we need.\

Time to build the attack string.

- Step 1: Match the 3 first groups
  - **a5**: Any alphanumerical char, I chose the letter *f*
  - **a23**: Literal space
  - **a35**: Withespace that isn't the underscore, I chose *\t*
- Step 2: Cram as many of **a5** as we can before the 24th char
- Step 3: Underscore
- Step 4: Anything we want to fill up to 35, can be used to get the right value of *b*.

## Solution
`f \tffffffffffffffffffff_DaddyIssues`

## Flag
`FLAG-ForgiveMeFatherForIHaveSinned`
