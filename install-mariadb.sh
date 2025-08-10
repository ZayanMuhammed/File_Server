# Debian Systems

sudo apt update
sudo apt install mariadb-server mariadb-client

#arch Systems

sudo pacman -Syu
sudo pacman -S mariadb

#start mariadb

sudo systemctl start mariadb
sudo systemctl enable mariadb

#enter database as root

mariadb -u root -p
