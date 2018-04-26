FROM node:8.9.3

RUN mkdir /build

WORKDIR /build/

ADD package.json /build/package.json
ADD package-lock.json /build/package-lock.json
ADD .nsprc /build/.nsprc
RUN npm install

ADD src /build/src
ADD scripts /build/scripts
ADD .eslintrc.js /build/.eslintrc.js
ADD .eslintignore /build/.eslintignore
