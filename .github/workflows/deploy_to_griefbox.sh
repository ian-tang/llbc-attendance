#!/bin/bash

mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/id_rsa
touch ~/.ssh/known_hosts
chmod 600 ~/.ssh/id_rsa ~/.ssh/known_hosts
cat ~/.ssh/id_rsa
echo $SSH_KEY >> ~/.ssh/id_rsa
echo "\n" >> ~/.ssh/id_rsa
echo $KNOWN_HOSTS >> ~/.ssh/known_hosts

ssh -v -oKexAlgorithms=+diffie-hellman-group1-sha1 -tt -i ~/.ssh/id_rsa "$SSH_USERNAME"@"$SSH_HOST" << EOF
		if [[ $(pwd) = "/home/peterfuller/cancelled.work" ]]; then
				rm -rf "pbc-attendance/";
				git clone "https://github.com/ian-tang/pbc-attendance";
		fi
EOF

rm ~/.ssh/{id_rsa,known_hosts}
