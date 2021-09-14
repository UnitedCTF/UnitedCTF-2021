# Character Customization

> Category: Reverse<br>
> Author: [@StrixSC](https://github.com/StrixSC) (Nawras M. A.)<br>
> Difficulty: Medium -> Hard

## Flag

`FLAG-REVERSING_IS_FUN_19as8933`


## Prompt

Here is an initial look at the character customization interface of our next game `Legends: Unite!`

Let us know what you think !

## Requirements

To run the challenge:

- Python 3

- docker-compose

To build the executable:

- CMake

- Make

## Setup
  
The `src` folder contains the source files to create the executable.

`CMake` and `Make` are required. To build, run the following commands:

```bash
mkdir build/ && \
cmake -B build/ -S src/ && \
cd build/ && \
make
```

(Remember to copy the executable inside of the `private/` and `public/` directory)

To start the server and setup the challenge, run the following command:

```bash
cd private/
docker-compose up --force-recreate --build --detach
```
  
## Difficulty

The challenge itself is pretty standard once you have a general idea of how to program behaves, but solving it will take some time as the code is so heavily obfuscated and in general hard to read. I initially wanted this to be an easy challenge, but it's probably more of a medium or hard challenge.

## Writeup
When running the program, the user will be prompted with a list of options to chose from in a menu.

```text
Hello Gamer...
Welcome to the character customization screen.
Select which option you'd like to customize.
1: Gender
2: Head
3: Face
4: Body
5: Equipment
6: Quit
```

This is a fairly standard reverse engineering challenge that focuses on static analysis (with a little bit of optional dynamic analysis). The flag can be obtained by selecting the options in a specific order that is hardcoded in the program.

The difficulty is with the obfuscation and the sheer amount of source code to go through which at first glance can be overwhelming.

Each option has a selection id. When an option is selected, the id is stored in a vector. In the end, the selected ids in the vector are compared to a list of ids. If they match, the flag is outputted. 

This challenge can be solved with any basic decompiler. Since the program is not stripped, it is easy to find the `flag.txt`, which we'll understand gets outputted if the `checkIfOverpowered()` function returns true.

We can find the `flag.txt` mention in the program's listing and match it up with the address found in the `ifstream` operator on the decompiled code.

From there, we can try to understand how to get to the `flag.txt`, which is when we'll find this:

```c++
  cVar3 = checkIfOverpowered((vector *)local_2b28,iVar1 - 0x28e8);
  std::vector<int,std::allocator<int>>::~vector((vector<int,std::allocator<int>> *)&local_28e8);
  if (cVar3 != '\0') {
    std::operator<<((basic_ostream *)std::cout,"Your character is too overpowered to continue.");
                    /* Open flag.txt */
```

 Then, what we want is  `cVar3` to be true. To achieve that, we must check what `checkIfOverpowered()` does and how can we make it return true.

```c++
/* checkIfOverpowered(std::vector<int, std::allocator<int>>&, std::vector<int, std::allocator<int>>)
    */

bool checkIfOverpowered(vector *param_1,vector.conflict param_2)

{
  bool bVar1;
  undefined4 in_register_00000034;
  
  bVar1 = std::operator==(param_1,(vector *)CONCAT44(in_register_00000034,param_2));
  return bVar1 != false;
}
```

checkIfOverpowered takes two vector parameters and compares them with the `==` overloaded operator. It them returns true if they match.

Let's try to understand where these two vectors are coming from :

```c++
cVar3 = checkIfOverpowered((vector *)local_2b28,iVar1 - 0x28e8);
```

The first vector is a local variable `local_2b28`. We can look for all references to this in the `main` function, and we'll find this:
```c++
      std::vector<int,std::allocator<int>>::push_back(local_2b28,piVar8);
```
Which is located inside of the main loop of the program:

```c++
  while( true ) {
    local_28e8 = std::vector<Menu,std::allocator<Menu>>::end(local_2ac8);
    bVar2 = __gnu_cxx::operator!=((__normal_iterator *)local_2908,(__normal_iterator *)&local_28e8);
    if (bVar2 == false) break;
    pMVar6 = (Menu *)__gnu_cxx::__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>>::
                     operator->((__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>> *)
                                local_2908);
    pbVar7 = (basic_string *)Menu::getChoice[abi:cxx11](pMVar6);
    _Var4 = std::vector<Menu,std::allocator<Menu>>::end(local_2ac8);
    _Var5 = std::vector<Menu,std::allocator<Menu>>::begin(local_2ac8);
    _Var4 = std::
            find<__gnu_cxx::__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>>,std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>>
                      (_Var5,_Var4,pbVar7);
    local_2908[0] = CONCAT44(extraout_var_00,_Var4);
    pMVar6 = (Menu *)__gnu_cxx::__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>>::
                     operator->((__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>> *)
                                local_2908);
    piVar8 = (int *)Menu::getId(pMVar6);
    if (*piVar8 == 0) break;
    pMVar6 = (Menu *)__gnu_cxx::__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>>::
                     operator->((__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>> *)
                                local_2908);
    piVar8 = (int *)Menu::getId(pMVar6);
    if (*piVar8 != 1) {
      pMVar6 = (Menu *)__gnu_cxx::__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>>::
                       operator->((__normal_iterator<Menu*,std::vector<Menu,std::allocator<Menu>>> *
                                  )local_2908);
      piVar8 = (int *)Menu::getId(pMVar6);
	  std::vector<int,std::allocator<int>>::push_back(local_2b28,piVar8);
    }
```

At the end of each iteration, if `piVar8` is not 1, it inserts it inside of `local_2b28` (the first vector of `checkIfOverpowered()`). Furthermore, `piVar8` gets assigned the return value of `Menu::getId(pMVar6)`

`pMVar6` seems to be the `iterator` of the `Menu` that is obtained on each iteration.

We can also find that if `piVar8 == 0`, the loop will break. This is where we should get a clearer idea of what the ids are. When running the program, the only way to kill it (stop the main loop) is to select the last option, which is to quit. By understanding this, we can thus understand that the quit option has an id of 0 and thus understand that each option has an id. 

At this point, we should know that the first vector is one that collects ids from `Menu::getId()` and that each Id is associated with an option in the main menu.

The second vector that is being compared in `checkIfOverpowered()` must thus have the same values inside.

We can use a debugger to dynamically analyze the values  inside of the second vector, or we can find it directly in the decompiled code, however the latter seems to a little bit harder, seeing as the program is so heavily obfuscated.

Using `gdb`, we can place a breakpoint at `checkIfOverpowered()` and run through the different instructions.

```bash
(gdb) break checkIfOverpowered(std::vector<int, std::allocator<int> >&, std::vector<int, std::allocator<int> >) 
Breakpoint 1 at 0x40252e
(gdb) run
Starting program: character_customization 
Hello Gamer...
Welcome to the character customization screen.
Select which option you'd like to customize.
1: Gender
2: Head
3: Face
4: Body
5: Equipment
6: Quit
1
Select gender.
1: Male
2: Female
3: Other
1
Male gender selected.
Select what you'd like to do next
1: Return to customization screen
2: Quit
2
```

Set a breakpoint at the checkIfOverpowered function and get the address of the second argument (which is located in the `rsi` register). 

```bash
Breakpoint 1, 0x000000000040252e in checkIfOverpowered(std::vector<int, std::allocator<int> >&, std::vector<int, std::allocator<int> >)
    ()
(gdb) info reg
rax            0x7fffffffb340      140737488335680
rbx            0x42f438            4387896
rcx            0x427eb0            4357808
rdx            0x7fffffffb580      140737488336256
rsi            0x7fffffffb580      140737488336256
rdi            0x7fffffffb340      140737488335680
rbp            0x7fffffffb120      0x7fffffffb120
rsp            0x7fffffffb120      0x7fffffffb120
r8             0x42b810            4372496
r9             0x415270            4280944
r10            0x1                 1
r11            0x246               582
r12            0x42f830            4388912
r13            0x10                16
r14            0x7fffffffcbe0      140737488341984
r15            0x2                 2
rip            0x40252e            0x40252e <checkIfOverpowered(std::vector<int, std::allocator<int> >&, std::vector<int, std::allocator<int> >)+8>
eflags         0x202               [ IF ]
cs             0x33                51
ss             0x2b                43
ds             0x0                 0
es             0x0                 0
fs             0x0                 0
gs             0x0                 0
```

We can then print the values at the address inside of the `rsi` register, using the  `*(ADDRESS)@Number` notation. Here I use double `**` to directly print the values at the pointer addresses. The N=30 is chosen arbitrarily. We can see `6, 11, 14, 15, 20, 22, 28, 29, 28, 31, 32, 37, 40, ... 0, 0, 0, 1041, etc`. If we recall to the decompiled main loop, we can remember that an id of 0 is not registered into the selected ids, therefore we can understand that the values that we need to input into the first vector are those starting from 6 until 44.

```
(gdb) p **0x7fffffffb580@30
$1 = {6, 11, 14, 15, 20, 22, 28, 29, 28, 31, 32, 37, 40, 32, 41, 44, 0, 0, 1041, 0, 1361066546, 175401333, 1869881454, 1937072928, 
  1768779636, 1769234810, 1931505263, 1701147235, 1870203502, 543434613}
```

**Note - It is also possible to get this list of inputs directly from the decompiled code, as they are all hardcoded. However, it can be a little hard to spot: **

```c++
  std::vector<int,std::allocator<int>>::vector(local_2b28);
  local_1288._0_4_ = 6;
  local_1288._4_4_ = 0xb;
  local_1280 = 0xe;
  local_127c = 0xf;
  local_1278 = 0x14;
  local_1274 = 0x16;
  local_1270 = 0x1c;
  local_126c = 0x1d;
  local_1268 = 0x1c;
  local_1264 = 0x1f;
  local_1260 = 0x20;
  local_125c = 0x25;
  local_1258 = 0x28;
  local_1254 = 0x20;
  local_1250 = 0x29;
  local_124c = 0x2c;

```

<hr> 

At this point, we know what we need to get the flag, all we need is to map these input ids to the respective inputs. Let's look back at the decompiled code.

The thing to note, is that each menu selection is lead by a local variable initialized to the respective id of the selection, that is then used to create the `Menu()` object for each respective menus. This is by far the hardest thing to understand in the challenge, because it requires the understanding of the program's behaviour and design.

```c++
                    /* try { // try from 004029d0 to 004029d4 has its CatchHandler @ 004072f2 */
  local_2bd8 = 2;
  std::allocator<char>::allocator();
                    /* try { // try from 00402a09 to 00402a0d has its CatchHandler @ 004072cb */
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string
            ((char *)local_2868,(allocator *)"Select gender.\n");
  std::allocator<char>::allocator();
                    /* try { // try from 00402a38 to 00402a3c has its CatchHandler @ 004072a4 */
  std::__cxx11::basic_string<char,std::char_traits<char>,std::allocator<char>>::basic_string
            ((char *)local_2888,(allocator *)"customize_gender");
                    /* try { // try from 00402a6a to 00402a6e has its CatchHandler @ 0040728c */
  Menu::Menu(aMStack4640,local_2888,local_2868,&local_2bd8,local_2a88);
```

Above, we can see `local_2bd8` initialized at 2, as well as `local_2888` corresponding to the `customize_gender` selection. Both of these local variables are then used to initalize a `Menu` object.

We can then match each id in the final vector with the ids that we previously found: 

- 6: `customize_head` (Select head customization)
- 11: `customize_beard` (Select beard customization)
- 14: `select_full` (Full beard)
- 15: `customize_face` (Continue customization and select customize face)
- 20: `customize_nose` (Select customize nose)
- 22: `select_medium_nose` (Select Medium-sized nose)
- 28: `customize_body` (Continue customization and select customize body)
- 29: `select_small_body` (Select small body)
- 28:  `customize_body` (Repeat: continue customization and select customize body)
- 31: `select_lean_body` (Select lean body)
- 32: `customize_equipment` (Continue customizataion and select customize equipment)
- 37:  `customize_body_armor` (Select customize body armor)
- 40: `select_leather_armor` (Select leather armor)
- 32: `select_customize_equipment` (Continue customization and select customize equipment)
- 41: `customize_weapon` (Select customize weapon)
- 44: `select_bow` (Select bow of swiftness)

Inputing these in the correct order will output the following sequence:

```bash
Your character is too overpowered to continue.
FLAG-REVERSING_IS_FUN_19as8933
```