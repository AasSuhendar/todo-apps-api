# base used
FROM telkomindonesia/alpine:nodejs-8.9.3

# Argumen for Jenkins
ARG PROJECT_PATH

# maintainer
MAINTAINER Aas Suhendar <aas.suhendar@gmail.com>

# Cached layer for node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p $PROJECT_PATH/usr/src/app \
  && cp -a /tmp/node_modules $PROJECT_PATH/usr/src

# Add project files
WORKDIR $PROJECT_PATH/usr/src/app
ADD . $PROJECT_PATH/usr/src/app

# update node_module, and change permission
RUN rm -rf node_modules \
  && mv $PROJECT_PATH/usr/src/node_modules $PROJECT_PATH/usr/src/app/

# expose port
EXPOSE 8080

# RUN command
CMD ["npm","start"]
