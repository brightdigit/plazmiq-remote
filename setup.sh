#!/bin/bash

sudo mkswap /dev/xvdf
sudo swapon /dev/xvdf
sudo yum -y install jsawk
sudo yum -y install git bzip2
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash
source ~/.bashrc
git clone $1 source
cd source
nvm install
nvm use
make
