FROM node:16.16.0-slim

RUN apt update && apt install -y procps

USER node

WORKDIR /home/node/app

# Para o container continuar funcionando
CMD ["tail", "-f", "/dev/null"]