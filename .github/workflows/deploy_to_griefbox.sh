#!/bin/bash

mkdir -p ~/.ssh
chmod 700 ~/.ssh
touch ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_ecdsa
cat $SSH_KEY >> ~/.ssh/id_ecdsa

ssh -i ~/.ssh/id_ecdsa "$SSH_USERNAME"@"$SSH_HOST" << EOF
		if [[ $(pwd) = "/home/peterfuller/cancelled.work" ]]; then
				rm -rf "pbc-attendance/";
				git clone "https://github.com/ian-tang/pbc-attendance";
		fi
EOF

rm ~/.ssh/id_ecdsa
