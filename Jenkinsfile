// global variable
def flagCheck     = false
def containerPort = ""
def containerEnv  = ""

// curl helper functiom
def curlRun(url, out) {
  script {
    if (out.equals('')) {
      out = 'http_code'
    }

    echo "Getting Output ${out} from ${url}"
    def result = sh (
      returnStdout: true,
      script: "curl --output /dev/null --silent --connect-timeout 5 --max-time 5 --retry 5 --retry-delay 5 --retry-max-time 30 --write-out \"%{${out}}\" ${url}"
    )

    echo "Result of (${out}): ${result}"
  }
}

// workspace cleaner helper function
def cleanUpWorkspace() {
  script {
    deleteDir()
  }
}

// docker cleaner helper function
def cleanUpDocker() {
  script {
    sh "docker stop '${params.DOCKER_REPOSITORY}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' || true"
    sh "docker rm -f '${params.DOCKER_REPOSITORY}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' || true"
    sh "docker rmi -f '${params.DOCKER_REGISTRY_URL}/${params.DOCKER_REPOSITORY}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}' || true"
    cleanUpWorkspace()
  }  
}

// pipeline declarative
pipeline {
  parameters {
    string(name: 'DOCKER_REGISTRY_URL',   description: 'Docker Registry URL',                             defaultValue: 'docker-registry-default.apps.playcourt.id')
    string(name: 'DOCKER_REGISTRY_TOKEN', description: 'Docker Registry Token',                           defaultValue: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZW1vcGxheWNvdXJ0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRvY2tlci1wdXNoZXItdG9rZW4tZDJ6dGoiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZG9ja2VyLXB1c2hlciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6Ijg5YWExYTI3LTVhNGUtMTFlOC1iZjczLTAwNTA1NjhjMmQ1MiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZW1vcGxheWNvdXJ0OmRvY2tlci1wdXNoZXIifQ.Kz_Uu1auwyYYH6Ko3uY7q56mVZNXScY3GGC3xuOh59gWm5dO_ZWwcO15UXbcNoyOEsa4WB9vrN0HncKAggxoCQQi9YnmxcEoAryCx1jWENuDv42nRUWglrvjEOkr4-jv8M5SUnHrzHAKgnjoYj5nGLzUzjhMukv6zmkRT38PGxLh30Ao5lMt2UWsIvgBu74wFnNehBQoguhxRcz6vX7eBuPL2rHEJx0jN9FSZqkyW9j2emqecL9YckTTPO7SHgcorYAJD8ZxmAD7yLbaMXeKrkDC0fO23nSbpFjdq3nm7jmMB07CwEg5jzkOpNycSznTM5xXgC2Jn1a71JEpNIRaaA')
    string(name: 'DOCKER_REPOSITORY',     description: 'Docker Repository',                               defaultValue: 'demoplaycourt')
    string(name: 'DOCKER_IMAGE_NAME',     description: 'Docker Image Name',                               defaultValue: 'todo-apps-api')
    string(name: 'DOCKER_IMAGE_TAG',      description: 'Docker Image Tag',                                defaultValue: 'latest')

    string(name: 'CONTAINER_PORT',        description: 'Container Port List Seperate with Commas',        defaultValue: '3000')
    string(name: 'CONTAINER_ENV',         description: 'Container Environment List Seperate with Commas', defaultValue: '')
  }

  agent none
  stages {
    stage("Initialize") {
      parallel {
        stage("Agent: NodeJS") {
          agent { label "jenkins-agent-nodejs-1" }
          steps {
            script {
              echo "Cleaning-up Environment"
              cleanUpWorkspace()

              echo "Setting-up Environment"
              def node = tool name: 'NodeJS-8.9', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
              env.PATH = "${node}/bin:${env.PATH}"

              echo "Checking-up Environment"
              sh 'node -v'
              sh 'npm -v'
            }
          }
        }

        stage("Agent: Docker") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              echo "Cleaning-up Environment"
              cleanUpDocker()

              echo "Checking-up Environment"
              sh 'docker --version'
            }
          }
        }
      }
    }

    stage("Checkout SCM") {
      parallel {
        stage("Agent: NodeJS") {
          agent { label "jenkins-agent-nodejs-1" }
          steps {            
            script {
              echo "Checking-out SCM"
              checkout scm              
            }
          }
        }

        stage("Agent: Docker") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              echo "Checking-out SCM"
              checkout scm              
            }
          }
        }
      }
    }

    stage("Unit Test & Analysis") {
      agent { label "jenkins-agent-nodejs-1" }
      steps {
        script {
          try {
            flagCheck = false

            echo "Install Dependencies"
            sh "npm install"

            echo "Run Unit Test"
            sh "npm test"

            flagCheck = true
          } finally {
            echo "Run JUnit Code Coverage"
            junit 'junit.xml'

            echo "Run SonarQube Analysis"
            def scannerHome = tool 'SonarQube Scanner';
            withSonarQubeEnv('SonarQube') {
              sh "${scannerHome}/bin/sonar-scanner"
            }

            if (flagCheck == false) {
              echo "Unit Test: Failed, Exiting Pipeline"
              cleanUpWorkspace()

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Unit Test: Success, Continuing Pipline"
            }
          }
        }
      }
    }

    stage("Containerize") {
      agent { label "jenkins-agent-docker-1" }
      steps {
        script {
          try {
            flagCheck = false
            
            echo "Docker Build Image"
            sh "docker build -t '${params.DOCKER_REGISTRY_URL}/${params.DOCKER_REPOSITORY}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}' ."

            echo "Parse Port & Environment Parameter"
            containerPort  = params.CONTAINER_PORT.tokenize(",")
            def stringPort = ""            
            containerPort.each { portValue ->
              stringPort  += "-p :${portValue} "
            }
            println stringPort
            def stringEnv  = ""
            containerEnv   = params.CONTAINER_ENV.tokenize(",")
            containerEnv.each { envValue ->
              stringEnv   += "-e ${envValue} "
            }
            println stringEnv

            echo "Docker Run Image"
            sh "docker run -d ${stringPort} ${stringEnv} --name '${params.DOCKER_REPOSITORY}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --rm '${params.DOCKER_REGISTRY_URL}/${params.DOCKER_REPOSITORY}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}'"
            sleep 5

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Containerize: Failed, Exiting Pipeline"
              cleanUpDocker()

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Containerize: Success, Continuing Pipeline"
            }
          }
        }
      }
    }

    stage("Container Test") {
      parallel {
        stage("Get http_code") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              try {
                flagCheck = false
                
                def exposedPort = ""
                containerPort.each { portValue ->
                  exposedPort = sh (
                    returnStdout: true,
                    script: "docker ps -a -f 'name=${params.DOCKER_REPOSITORY}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | awk '{for(i=1;i<=NF;i++){tmp=match(\$i,/${portValue}/);if(tmp){print \$i}}}' | cut -d'-' -f1 | cut -d':' -f2"
                  )

                  curlRun("127.0.0.1:${exposedPort}", "http_code")
                }

                flagCheck = true
              } finally {
                if (flagCheck == false) {
                  echo "Container Test: Failed, Exiting Pipeline"
                  cleanUpDocker()

                  sh "exit 1"
                } else {
                  echo "Container Test: Success, Continuing Pipeline"
                }
              }
            }
          }
        }

        stage("Get time_total") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              try {
                flagCheck = false                
                
                def exposedPort = ""
                containerPort.each { portValue ->
                  exposedPort = sh (
                    returnStdout: true,
                    script: "docker ps -a -f 'name=${params.DOCKER_REPOSITORY}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | awk '{for(i=1;i<=NF;i++){tmp=match(\$i,/${portValue}/);if(tmp){print \$i}}}' | cut -d'-' -f1 | cut -d':' -f2"
                  )

                  curlRun("127.0.0.1:${exposedPort}", "time_total")
                }

                flagCheck = true
              } finally {
                if (flagCheck == false) {
                  echo "Container Test: Failed, Exiting Pipeline"
                  cleanUpDocker()

                  currentBuild.result = 'FAILURE'
                  sh "exit 1"
                } else {
                  echo "Container Test: Success, Continuing Pipeline"
                }
              }
            }
          }
        }

        stage("Get size_download") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              try {
                flagCheck = false
                
                def exposedPort = ""
                containerPort.each { portValue ->
                  exposedPort = sh (
                    returnStdout: true,
                    script: "docker ps -a -f 'name=${params.DOCKER_REPOSITORY}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | awk '{for(i=1;i<=NF;i++){tmp=match(\$i,/${portValue}/);if(tmp){print \$i}}}' | cut -d'-' -f1 | cut -d':' -f2"
                  )

                  curlRun("127.0.0.1:${exposedPort}", "size_download")
                }
                
                flagCheck = true
              } finally {
                if (flagCheck == false) {
                  echo "Container Test: Failed, Exiting Pipeline"
                  cleanUpDocker()

                  currentBuild.result = 'FAILURE'
                  sh "exit 1"
                } else {
                  echo "Container Test: Success, Continuing Pipeline"
                }
              }
            }
          }
        }
      }
    }

    stage("Pushing Image to Docker Registry") {
      agent { label "jenkins-agent-docker-1" }
      steps {
        script {
          try {
            flagCheck = false

            echo "Logging-in to Docker Registry"
            sh "docker login --username='${params.DOCKER_REPOSITORY}' --password='${params.DOCKER_REGISTRY_TOKEN}' ${params.DOCKER_REGISTRY_URL}"

            echo "Pushing Image to Docker Registry"
            sh "docker push '${params.DOCKER_REGISTRY_URL}/${params.DOCKER_REPOSITORY}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}'"

            echo "Logging-out from Docker Registry"
            sh "docker logout ${params.DOCKER_REGISTRY_URL}"

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Pushing Image to Docker Registry: Failed, Exiting Pipeline"
              cleanUpDocker()

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Pushing Image to Docker Registry: Success, Continuing Pipeline"
            }
          }
        }
      }
    }

    stage("Finalize") {
      parallel {
        stage("Agent: NodeJS") {
          agent { label "jenkins-agent-nodejs-1" }
          steps {
            script {
              echo "Cleaning-up Environment"
              cleanUpWorkspace()
            }
          }
        }

        stage("Agent: Docker") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              echo "Cleaning-up Environment"
              cleanUpDocker()
            }
          }
        }
      }
    }

  }
}