#ifndef GAMEPAD_MENU_H
#define GAMEPAD_MENU_H

#include <iostream>
#include <vector>


class Menu {
/// Code was taken from this post: https://codereview.stackexchange.com/questions/49614/text-based-adventure-game-with-too-many-conditional-statements

public:
    Menu(const std::string &name, const std::string &prompt, const int& id,
         const std::vector<std::pair<std::string, std::string> > &choices
         = std::vector<std::pair<std::string, std::string> >{});
    virtual ~Menu();
    const std::string& getChoice() const;
    const std::string& getName() const;
    const int& getId() const;
    bool operator==(const std::string &name) const;
private:
    static const std::string menuend;
    int _id;
    std::string _name, _prompt;
    std::vector<std::pair<std::string, std::string>> _choices;
};


#endif //GAMEPAD_MENU_H
