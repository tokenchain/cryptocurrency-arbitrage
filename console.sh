#!/bin/bash
UESRFOLDER=hesk

NORMAL=`echo "\033[m"`
MENU=`echo "\033[36m"` #Blue
NUMBER=`echo "\033[33m"` #yellow
FGRED=`echo "\033[41m"`
RED_TEXT=`echo "\033[31m"`
ENTER_LINE=`echo "\033[33m"`

function show_menu(){


    echo "${MENU}     ÛÛÛÛÛÛÛÛÛÛÛ                     ÛÛÛÛÛ                                 ÛÛÛ ${NORMAL}"
    echo "${MENU}    °Û°°°°°°ÛÛÛ                     °°ÛÛÛ                                 °°°  ${NORMAL}"
    echo "${MENU}    °     ÛÛÛ°  ÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛÛÛ  ÛÛÛÛÛÛÛ   ÛÛÛÛÛÛ  ÛÛÛÛÛ ÛÛÛÛÛÛÛÛÛÛÛÛ  ÛÛÛÛ ${NORMAL}"
    echo "${MENU}         ÛÛÛ   °°ÛÛÛ °ÛÛÛ°°ÛÛÛ°°ÛÛÛ°°°ÛÛÛ°   °°°°°ÛÛÛ°°ÛÛÛ °ÛÛÛ°°ÛÛÛ°°ÛÛÛ°°ÛÛÛ ${NORMAL}"
    echo "${MENU}        ÛÛÛ     °ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ  °ÛÛÛ     ÛÛÛÛÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ °°°  °ÛÛÛ ${NORMAL}"
    echo "${MENU}      ÛÛÛÛ     Û°ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ  °ÛÛÛ ÛÛÛÛÛÛ°°ÛÛÛ °ÛÛÛ °ÛÛÛ °ÛÛÛ      °ÛÛÛ ${NORMAL}"
    echo "${MENU}     ÛÛÛÛÛÛÛÛÛÛÛ°°ÛÛÛÛÛÛÛ ÛÛÛÛ ÛÛÛÛÛ °°ÛÛÛÛÛ°°ÛÛÛÛÛÛÛÛ°°ÛÛÛÛÛÛÛÛÛÛÛÛÛ     ÛÛÛÛÛ${NORMAL}"
    echo "${MENU}    °°°°°°°°°°°  °°°°°ÛÛÛ°°°° °°°°°   °°°°°  °°°°°°°°  °°°°°°°°°°°°°     °°°°° ${NORMAL}"
    echo "${MENU}                 ÛÛÛ °ÛÛÛ                                                      ${NORMAL}"
    echo "${MENU}                °°ÛÛÛÛÛÛ                                                       ${NORMAL}"
    echo "${MENU}                 °°°°°°                                                        ${NORMAL}"

    echo "${MENU}**${NUMBER} 1)${MENU} Update ccxt and restart the server ${NORMAL}"
    echo "${MENU}**${NUMBER} 2)${MENU} Start server for testing environment ${NORMAL}"

    echo "${MENU}*********************************************${NORMAL}"
    echo "${ENTER_LINE}Please enter a menu option and enter or ${RED_TEXT}enter to exit. ${NORMAL} or press x to exit"
    read opt
}
function option_picked() {
    COLOR='\033[01;31m' # bold red
    RESET='\033[00;00m' # normal white
    MESSAGE=${@:-"${RESET}Error: No message passed👈"}
    echo "${COLOR}${MESSAGE}${RESET}"
}
function compile_js(){
    NODE_ENV=production node node_modules/webpack/bin/webpack.js --progress --hide-modules --config=node_modules/laravel-mix/setup/webpack.config.js
}
function arbitrage_pairs(){
  arbitrage-pairs.js
}
clear
show_menu
while [ opt != '' ]
    do
    if [[ $opt = "" ]]; then
            exit;
    else
     case $opt in
       2) clear;
          option_picked "Option 1 Picked operation for import translation data to displaymenu";
          ##sh gdtransb.sh;

          show_menu;
          ;;

       1) clear;
          option_picked "Using new ccxt library..";
          yarn add ccxt
          yarn start
          ;;

       a) clear;
          option_picked "engine run watch js development"
          yarn watch-poll
          ;;

       x) exit;
          ;;

        *)clear;
        option_picked "Pick an option from the menu";
        show_menu;
        ;;
    esac
fi
done
