# API-Todo List
API Endpoint to Todo List. Please use node js version v8.0.0 or higger.

## How to run
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm start

# Other option use nodemen and run in root project
nodemon

# run testing
npm run test

# Cucumber Testing
npm run integration

```

#Jenkinsfile
This Jenkinsfile use a declarative pipeline that push to image registry at the of the pipeline.
In this Jenkinsfile there are some stage which is:
1. Initialize
2. Checkout SCM
3. Unit Test & Analysis
4. Contenarized
5. Container Test
6. Integration Test
7. Pushing Image to Private Registry
8. Finalize

#SonarQube
This repo is already include with sonar.project.properties

readme updated.
Any Question ? ask admin