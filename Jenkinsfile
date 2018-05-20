// global variable
def flagCheck     = false
def containerPort = ""
def containerEnv  = ""

// curl helper functiom
def curlRun (url, out) {
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

// pipeline declarative
pipeline {
  parameters {
    // string(name: 'DEV_KUBE_URL',        description: 'Kubernetes URL for Development',                   defaultValue: '')
    // string(name: 'DEV_KUBE_TOKEN',      description: 'Kubernetes Token for Development',                 defaultValue: '')
    // string(name: 'PROD_KUBE_URL',       description: 'Kubernetes URL for Production',                    defaultValue: '')
    // string(name: 'PROD_KUBE_TOKEN',     description: 'Kubernetes Token for Production',                  defaultValue: '')
    
    string(name: 'DOCKER_REPO_URL',      description: 'Docker Repository URL',                           defaultValue: '')
    string(name: 'DOCKER_REPO_TOKEN',    description: 'Docker Repository Token',                         defaultValue: '')
    string(name: 'DOCKER_REPO_USERNAME', description: 'Docker Repository Username',                      defaultValue: '')
    string(name: 'DOCKER_IMAGE_NAME',    description: 'Docker Image Name',                               defaultValue: '')
    string(name: 'DOCKER_IMAGE_TAG',     description: 'Docker Image Tag',                                defaultValue: '')

    string(name: 'CONTAINER_PORT',       description: 'Container Port List Seperate with Commas',        defaultValue: '')
    string(name: 'CONTAINER_ENV',        description: 'Container Environment List Seperate with Commas', defaultValue: '')
  }

  agent none
  stages {
    stage("Initialize") {
      parallel {
        stage("Agent: NodeJS") {
          steps {
            agent { node { label "jenkins-agent-nodejs-1" } }

            script {
              echo "Cleaning-up Environment"
              deleteDir()

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
          steps {
            agent { node { label "jenkins-agent-docker-1" } }

            script {
              echo "Cleaning-up Environment"
              deleteDir()

              echo "Checking-up Environment"
              sh 'docker --version'
            }
          }
        }
      }
    }

    stage("Check SCM") {
      parallel {
        stage("Agent: NodeJS") {
          steps {
            agent { node { label "jenkins-agent-nodejs-1"} }
            
            script {
              echo "Checking-out SCM"
              checkout scm              
            }
          }
        }

        stage("Agent: Docker") {
          steps {
            agent { node { label "jenkins-agent-docker-1"} }

            script {
              echo "Checking-out SCM"
              checkout scm              
            }
          }
        }
      }
    }

    stage("Unit Test & Analysis") {
      steps {
        agent { node { label "jenkins-agent-nodejs-1" } }

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
              sh "exit 1"
            } else {
              echo "Unit Test: Success, Continuing Pipline"
            }
          }
        }
      }
    }

    stage("Containerize") {
      steps {
        agent { node { label "jenkins-agent-dacker-1" } }

        script {
          try {
            flagCheck = false
            
            echo "Docker Build Image"
            sh "docker build -t ${params.DOCKER_REPO_URL}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG} ."

            echo "Parse Port & Environment Parameter"
            containerPort  = params.CONTAINER_PORT.tokenize(",")
            def stringPort    = ""            
            containerPort.each { portValue ->
              stringPort  += "-p :${portValue} "
            }
            println stringPort
            def stringEnv     = ""
            containerEnv   = params.CONTAINER_ENV.tokenize(",")
            containerEnv.each { envValue ->
              stringEnv   += "-e ${envValue} "
            }
            println stringEnv

            echo "Docker Run Image"
            sh "docker run -d ${stringPort} ${stringEnv} --name ${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG} --rm ${params.DOCKER_REPO_URL}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}"
            sleep 5

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Containerize: Failed, Exiting Pipeline"
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
          steps {
            agent { node { label "jenkins-agent-docker-1" } }
            
            script {
              def exposedPort = ""
              containerPort.each { portValue ->
                exposedPort = sh (
                  returnStdout: true,
                  script: "docker ps -a -f 'name=${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | awk '{for(i=1;i<=NF;i++){tmp=match($i,/${portValue}/);if(tmp){print $i}}}' | cut -d'-' -f1 | cut -d':' -f2"
                )

                curlRun("127.0.0.1:${exposedPort}", "http_code")
              }
            }
          }
        }

        stage("Get time_total") {
          steps {
            agent { node { label "jenkins-agent-docker-1" } }

            script {
              def exposedPort = ""
              containerPort.each { portValue ->
                exposedPort = sh (
                  returnStdout: true,
                  script: "docker ps -a -f 'name=${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | awk '{for(i=1;i<=NF;i++){tmp=match($i,/${portValue}/);if(tmp){print $i}}}' | cut -d'-' -f1 | cut -d':' -f2"
                )

                curlRun("127.0.0.1:${exposedPort}", "time_total")
              }
            }
          }
        }

        stage("Get size_download") {
          steps {
            agent { node { label "jenkins-agent-docker-1" } }
            
            script {
              def exposedPort = ""
              containerPort.each { portValue ->
                exposedPort = sh (
                  returnStdout: true,
                  script: "docker ps -a -f 'name=${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | awk '{for(i=1;i<=NF;i++){tmp=match($i,/${portValue}/);if(tmp){print $i}}}' | cut -d'-' -f1 | cut -d':' -f2"
                )

                curlRun("127.0.0.1:${exposedPort}", "size_download")
              }
            }
          }
        }
      }
    }

    stage("Pushing Image to Docker Registry") {
      steps {
        agent { node { label "jenkins-agent-docker-1"} }

        script {
          try {
            echo "Logging-in to Docker Repository ${params.DOCKER_REPO_URL}"
            sh "docker login --username=${params.DOCKER_REPO_USERNAME} --password=${params.DOCKER_REPO_TOKEN} ${params.DOCKER_REPO_URL}"

            echo "Pushing Image ${params.DOCKER_REPO_URL}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}"
            sh "docker push ${params.DOCKER_REPO_URL}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}"

            echo "Logging-out from Docker Repository ${params.DOCKER_REPO_URL}"
            sh "docker logout ${params.DOCKER_REPO_URL}"
          } catch(e) {
            throw e
          }
        }
      }
    }

    stage("Finalize") {
      parallel {
        stage("Agent: NodeJS") {
          steps {
            script {
              echo "Cleaning-up Environment"
              deleteDir()              
            }
          }
        }

        stage("Agent: Docker") {
          steps {
            script {
              echo "Cleaning-up Environment"
              sh "docker rm -f ${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}"
              sh "docker rmi -f ${params.DOCKER_REPO_URL}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}"
              deleteDir()
            }
          }
        }
      }
    }

  }
}