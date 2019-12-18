# base image used
FROM aassuhendar/alpine-based:nodejs-8.9

# Add project files
WORKDIR /usr/src/app

# Cached layer for node modules
COPY package.json /tmp/package.json
RUN cd /tmp && npm i -g npm && npm install --production
RUN mkdir -p /usr/src/app \
  && cp -a /tmp/node_modules /usr/src

# add file to constainer
COPY . /usr/src/app

# setting pm2 
RUN rm -rf /tmp/node_modules \
  && mv /usr/src/node_modules /usr/src/app/ \
  && mkdir -p /.pm2 \
  && chown -R user:root /.pm2 \
  && chmod 775 /.pm2 

# expose port
EXPOSE 3000

# RUN command
CMD ["pm2-runtime", "ecosystem.config.js"]
