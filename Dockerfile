FROM node:16 AS production

ADD . /usr/src/app/
WORKDIR /usr/src/app

RUN chown -R node /usr/src/app
USER node

RUN mkdir ~/.npm-global && npm config set prefix '~/.npm-global'
ENV PATH=~/.npm-global/bin:$PATH

RUN npm install -g @nestjs/cli
RUN npm -q ci

RUN npm run build

ARG APP_PORT=4000
ENV APP_PORT=$APP_PORT
EXPOSE $APP_PORT

CMD npm run start:prod
