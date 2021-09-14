#include "Menu.h"
#include<limits>

Menu::Menu(const std::string &name, const std::string &prompt, const int& id,
           const std::vector<std::pair<std::string, std::string> > &choices)
        : _name(name), _id(id), _prompt(prompt), _choices(choices) {}

bool Menu::operator==(const std::string &name) const {
    return name == _name;
}

const std::string &Menu::getName() const {
    return this->_name;
}

const int& Menu::getId() const {
    return this->_id;
}

const std::string &Menu::getChoice() const {
    if (_choices.size() == 0) {
        std::cout << _prompt;
        return menuend;
    }
    int choice;
    int i;
    do {
        std::cout << _prompt;
        i = 1;

        for (auto ch: _choices) {
            std::cout << i++ << ": " << ch.first << '\n';
        }

        while(!(std::cin >> choice)){
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << "Invalid input" << std::endl;
        }

        --choice;
    } while (choice >= _choices.size());
    return _choices[choice].second;
}

Menu::~Menu() {}

const std::string Menu::menuend{"END"};