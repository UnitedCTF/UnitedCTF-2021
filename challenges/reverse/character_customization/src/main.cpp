#include <iostream>
#include <vector>
#include "Menu.h"
#include <algorithm>
#include <fstream>

bool checkIfOverpowered(std::vector<int> &choices, std::vector<int> opCharacterIds) {
    if (choices == opCharacterIds) {
        return true;
    }

    return false;
}

int main() {
    std::vector<int> choices;
    std::vector<int> opCharacterIds{6, 11, 14, 15, 20, 22, 28, 29, 28, 31, 32, 37, 40, 32, 41, 44};
    auto defaultChoices = std::vector<std::pair<std::string, std::string>>{
            {"Return to customization screen", "start"},
            {"Quit",                           "quit"}
    };

    std::vector<Menu> game{
            Menu("start",
                 "Hello Gamer...\nWelcome to the character customization screen.\nSelect which option you'd like to customize.\n",
                 1,
                 std::vector<std::pair<std::string, std::string> >{
                         {"Gender",    "customize_gender"},
                         {"Head",      "customize_head"},
                         {"Face",      "customize_face"},
                         {"Body",      "customize_body"},
                         {"Equipment", "customize_equipment"},
                         {"Quit",      "quit"}
                 }),
            Menu("customize_gender", "Select gender.\n",
                 2,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Male",   "select_male"},
                         {"Female", "select_female"},
                         {"Other",  "select_other"},
                 }),
            Menu("select_male", "Male gender selected.\nSelect what you'd like to do next\n", 3, defaultChoices),
            Menu("select_female", "Female gender selected.\nSelect what you'd like to do next\n", 4, defaultChoices),
            Menu("select_other", "Other gender selected.\nSelect what you'd like to do next\n", 5, defaultChoices),
            Menu("customize_head", "Select which option you'd like to customize.\n",
                 6,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Hair",  "customize_hair"},
                         {"Beard", "customize_beard"},
                 }),
            Menu("customize_hair", "Select which type of hair you'd like to use\n",
                 7,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Long & Luscious", "select_long"},
                         {"Short & Curly",   "select_short"},
                         {"Buzz",            "select_buzz"}
                 }),
            Menu("select_long", "Long & Luscious selected.\nSelect what you'd like to do next\n", 8, defaultChoices),
            Menu("select_short", "Short & Curly selected.\nSelect what you'd like to do next\n", 9, defaultChoices),
            Menu("select_buzz", "Buzz-cut hair selected.\nSelect what you'd like to do next\n", 10, defaultChoices),
            Menu("customize_beard", "Select which type of beard you'd like to use\n",
                 11,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Goatee",     "select_goatee"},
                         {"Stubble",    "select_stubble"},
                         {"Full beard", "select_full"}
                 }),
            Menu("select_goatee", "Goatee beard selected.\nSelect what you'd like to do next\n", 12, defaultChoices),
            Menu("select_stubble", "Stubble beard selected.\nSelect what you'd like to do next\n", 13, defaultChoices),
            Menu("select_full", "Full beard selected.\nSelect what you'd like to do next\n", 14, defaultChoices),
            Menu("customize_face", "Select which option you'd like to customize\n",
                 15,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Eyes",  "customize_eyes"},
                         {"Nose",  "customize_nose"},
                         {"Mouth", "customize_mouth"},
                 }),
            Menu("customize_eyes", "Select which type of eye you'd like to use\n",
                 16,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Wide",          "select_wide_eyes"},
                         {"Small",         "select_small_eyes"},
                         {"Almond-shaped", "select_almond_eyes"}
                 }),
            Menu("select_wide_eyes", "Wide eyes selected.\nSelect what you'd like to do next\n",
                 17, defaultChoices),
            Menu("select_small_eyes", "Small eyes selected.\nSelect what you'd like to do next\n",
                 18, defaultChoices),
            Menu("select_almond_eyes", "Almond-shaped eyes selected.\nSelect what you'd like to do next\n",
                 19, defaultChoices),
            Menu("customize_nose", "Select which type of nose you'd like to use\n",
                 20,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Small-sized",  "select_small_nose"},
                         {"Medium-sized", "select_medium_nose"},
                         {"Large-sized",  "select_large_nose"}
                 }),
            Menu("select_small_nose", "Small nose selected.\nSelect what you'd like to do next\n", 21, defaultChoices),
            Menu("select_medium_nose", "Medium nose selected.\nSelect what you'd like to do next\n", 22,
                 defaultChoices),
            Menu("select_large_nose", "Large nose selected.\nSelect what you'd like to do next\n", 23,
                 defaultChoices),
            Menu("customize_mouth", "Select which type of mouth you'd like to use\n",
                 24,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Small-sized",  "select_small_mouth"},
                         {"Medium-sized", "select_medium_mouth"},
                         {"Large-sized",  "select_large_mouth"}
                 }),
            Menu("select_small_mouth", "Small mouth selected.\nSelect what you'd like to do next\n", 25,
                 defaultChoices),
            Menu("select_medium_mouth", "Medium mouth selected.\nSelect what you'd like to do next\n", 26,
                 defaultChoices),
            Menu("select_large_mouth", "Large mouth selected.\nSelect what you'd like to do next\n", 27,
                 defaultChoices),
            Menu("customize_body", "Select which type of body you'd like to use\n",
                 28,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Small & Slender", "select_small_body"},
                         {"Large & Robust",  "select_large_body"},
                         {"Lean",            "select_lean_body"}
                 }),
            Menu("select_small_body", "Small & Slender body selected.\nSelect what you'd like to do next\n", 29,
                 defaultChoices),
            Menu("select_large_body", "Large & Robust body selected.\nSelect what you'd like to do next\n", 30,
                 defaultChoices),
            Menu("select_lean_body", "Lean body selected.\nSelect what you'd like to do next\n", 31,
                 defaultChoices),
            Menu("customize_equipment", "Select which option you'd like to customize\n",
                 32,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Helmet",     "customize_helmet"},
                         {"Body armor", "customize_body_armor"},
                         {"Weapon",     "customize_weapon"},
                 }),
            Menu("customize_helmet", "Select which type of helmet/head armor you'd like to use\n",
                 33,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Light hood: Increases your stamina by 20 points and increases your agility by 30 points.",               "select_hood_helmet"},
                         {"Steel helm: Increases your health by 30 points and increase your one-handed combat skill by 10 points.", "select_steel_helmet"},
                         {"No helmet: Increase your courage by 20 points.",                                                         "select_no_helmet"}
                 }),
            Menu("select_hood_helmet", "Light hood selected.\nSelect what you'd like to do next\n", 34,
                 defaultChoices),
            Menu("select_steel_helmet", "Steel helm selected.\nSelect what you'd like to do next\n", 35,
                 defaultChoices),
            Menu("select_no_helmet", "No helmet selected.\nSelect what you'd like to do next\n", 36,
                 defaultChoices),
            Menu("customize_body_armor", "Select which type of body armor you'd like to use\n",
                 37,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Mage robe: Increase your mana regeneration by 30 points and your spell-casting by 30 points.",            "select_mage_robe"},
                         {"Steel armor: Increases your health by 60 points and increase your one-handed combat skill by 20 points.", "select_steel_armor"},
                         {"Leather armor: Increases your stamina by 40 points and increases your agility by 60 points.",             "select_leather_armor"}
                 }),
            Menu("select_mage_robe", "Mage robe selected.\nSelect what you'd like to do next\n", 38,
                 defaultChoices),
            Menu("select_steel_armor", "Steel armor selected.\nSelect what you'd like to do next\n", 39,
                 defaultChoices),
            Menu("select_leather_armor", "Leather armor selected.\nSelect what you'd like to do next\n", 40,
                 defaultChoices),
            Menu("customize_weapon", "Select which weapon you'd like to carry.\n",
                 41,
                 std::vector<std::pair<std::string, std::string>>{
                         {"Staff of madness: Ability to perform Chaos Discharge: a powerful spell blasts that attacks all foes in a range and increases your spell-casting by 100 poitns.", "select_staff"},
                         {"Sword of divine: Ability to perform Quickslash: a quick swing that attacks all nearby foes and increases your hp by 50 points.",                                 "select_sword"},
                         {"Bow of swiftness: Ability to cast Voltbolt: a very fast arrow equipped with the sharpest blade and increases your agility by 100 points.",                       "select_bow"}
                 }),
            Menu("select_staff", "Staff of madness selected.\nSelect what you'd like to do next\n", 42,
                 defaultChoices),
            Menu("select_sword", "Sword of divine selected.\nSelect what you'd like to do next\n", 43,
                 defaultChoices),
            Menu("select_bow", "Bow of swiftness selected.\nSelect what you'd like to do next\n", 44,
                 defaultChoices),
            Menu("quit", "", 0, {})
    };

    auto menu = std::find(game.begin(), game.end(), "start");
    while (menu != game.end()) {
        menu = std::find(game.begin(), game.end(), menu->getChoice());
        if (menu->getId() == 0) {
            break;
        }

        if (menu->getId() != 1) {
            choices.push_back(menu->getId());
        }
    }

    if (checkIfOverpowered(choices, opCharacterIds)) {
        std::cout << "Your character is too overpowered to continue.";
        std::ifstream flag("./flag.txt");
        std::string line;
        if (flag.is_open()) {
            std::cout << std::endl;
            while (getline(flag, line)) {
                std::cout << line << std::endl;
            }
            flag.close();
        } else {
            std::cout << "Flag file missing." << std::endl;
        }
    }

    std::cout << "Good luck on the battlefield, Gamer." << std::endl;

    return 0;
}
