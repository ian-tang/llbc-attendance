FROM ubuntu:latest

RUN apt-get update && \
	apt-get install -y openssh-client && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /home/deploy

COPY id_ecdsa .
COPY known_hosts .
COPY config .
COPY deploy_to_griefbox.sh .

RUN mkdir $HOME/.ssh && \
	mv id_ecdsa known_hosts config $HOME/.ssh && \
	chmod 600 $HOME/.ssh/id_ecdsa $HOME/.ssh/known_hosts $HOME/.ssh/config

RUN echo $(wc -l $HOME/.ssh/id_ecdsa)

RUN chmod +x deploy_to_griefbox.sh

CMD ["bash", "./deploy_to_griefbox.sh"]
