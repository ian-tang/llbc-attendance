#!/bin/bash

ssh_clone() {
	ssh -v -tt -F ~/.ssh/config -i ~/.ssh/id_ecdsa peterfuller@cancelled.work << 'EOF'
if [[ $(pwd) = "/home/peterfuller/cancelled.work" ]]; then
	rm -rf "pbc-attendance"
	git clone "https://github.com/ian-tang/pbc-attendance"
fi
exit
EOF
}

ssh_clone
