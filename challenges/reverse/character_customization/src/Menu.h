#ifndef GAMEPAD_MENU_H
#define GAMEPAD_MENU_H

#include <iostream>
#include <vector>


class Menu {
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
    std::string _name, _prompt;
    int _id;
    std::vector<std::pair<std::string, std::string> > _choices;
};


#endif //GAMEPAD_MENU_H
