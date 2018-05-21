# base used
FROM telkomindonesia/alpine:nodejs-8.9.3

# maintainer
MAINTAINER krisna

# Add project files
WORKDIR /usr/src/app

# Cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /usr/src/app \
  && cp -a /tmp/node_modules /usr/src/app

ADD . /usr/src/app

# expose port
EXPOSE 3000

# RUN command
CMD ["npm","start"]
