cmake_minimum_required(VERSION 3.14)
project(character_customization)
include(CheckPIESupported)
check_pie_supported()

set(CMAKE_CXX_STANDARD 14)

add_executable(character_customization main.cpp Menu.cpp Menu.h)
set_property(TARGET character_customization PROPERTY POSITION_INDEPENDENT_CODE FALSE)
