// global variable
def flagCheck     = false
def gitTagName    = ""
def gitHeadMatch  = false
def containerPort = ""
def containerEnv  = ""
def kubeCMD       = ""

// curl helper functiom
def curlRun(url, out="") {
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
def cleanUpDocker(containerName="", imageName="") {
  script {
    if (! containerName.equals('')) {
      sh "docker stop '${containerName}' || true"
      sh "docker rm -f '${containerName}' || true"
    }
    
    if (! imageName.equals('')) {
      sh "docker rmi -f '${imageName}' || true"
    }

    cleanUpWorkspace()
  }  
}

// pipeline declarative
pipeline {
  parameters {
    booleanParam(name: 'KUBE_DEV_IS_OC',       description: 'Kubernetes Development is OpenShift',               defaultValue: true)    
    string(name: 'KUBE_DEV_VERSION',           description: 'Kubernetes Development Version',                    defaultValue: '1.6.1')
    string(name: 'KUBE_DEV_URL',               description: 'Kubernetes Development URL',                        defaultValue: 'https://console.playcourt.id')
    string(name: 'KUBE_DEV_TOKEN',             description: 'Kubernetes Development Token',                      defaultValue: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZW1vcGxheWNvdXJ0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImplbmtpbnMtZXh0LXRva2VuLXdqZHI1Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQubmFtZSI6ImplbmtpbnMtZXh0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiZDQxYzJkMzEtNThkOC0xMWU4LWFmZmMtMDA1MDU2OGM0YzQyIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50OmRlbW9wbGF5Y291cnQ6amVua2lucy1leHQifQ.VuxG9HDqW6yFoP_rVq0TxP1bzfGtVoH5EMqaz4tBJdQUajOvmrjJmFSrXkrp5RLfNOGdab7oNU4xLt1wgeNRMxwTsBOHDPLLAabxWA6bkRdysNHoMjFL0f0rwKHdEncmMEtoXpM0bp3Rss1FIpYDKb0LwHCbDMyaw6u3ZxvnYIAWeLN3_aB4DyHpwJkDIO8xH9rJKDKMq-8v2DpDCxDmqt1Y71Q6nksNMfBrRF-d0c1xxynUuXIZhiXuogCEypX3bnOYr576eSSH-_4xQX2jSD-xwPKTp9qa60IYHzSEqDYfRBZpTYyGZBZVGYs4lZdhCjrt8FsfvlCXdvu4coDMbw')
    string(name: 'KUBE_DEV_NAMESPACE',         description: 'Kubernetes Development Namespace',                  defaultValue: 'demoplaycourt')
    
    string(name: 'DOCKER_DEV_REGISTRY_URL',    description: 'Docker Development Registry URL',                   defaultValue: 'docker-registry-default.apps.playcourt.id')
    string(name: 'DOCKER_DEV_REGISTRY_TOKEN',  description: 'Docker Development Registry Token',                 defaultValue: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZW1vcGxheWNvdXJ0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImRvY2tlci1wdXNoZXItdG9rZW4tZDJ6dGoiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZG9ja2VyLXB1c2hlciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6Ijg5YWExYTI3LTVhNGUtMTFlOC1iZjczLTAwNTA1NjhjMmQ1MiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZW1vcGxheWNvdXJ0OmRvY2tlci1wdXNoZXIifQ.Kz_Uu1auwyYYH6Ko3uY7q56mVZNXScY3GGC3xuOh59gWm5dO_ZWwcO15UXbcNoyOEsa4WB9vrN0HncKAggxoCQQi9YnmxcEoAryCx1jWENuDv42nRUWglrvjEOkr4-jv8M5SUnHrzHAKgnjoYj5nGLzUzjhMukv6zmkRT38PGxLh30Ao5lMt2UWsIvgBu74wFnNehBQoguhxRcz6vX7eBuPL2rHEJx0jN9FSZqkyW9j2emqecL9YckTTPO7SHgcorYAJD8ZxmAD7yLbaMXeKrkDC0fO23nSbpFjdq3nm7jmMB07CwEg5jzkOpNycSznTM5xXgC2Jn1a71JEpNIRaaA')

    string(name: 'DOCKER_IMAGE_NAME',          description: 'Docker Image Name',                                 defaultValue: 'todo-apps-api')
    string(name: 'DOCKER_IMAGE_TAG',           description: 'Docker Image Tag',                                  defaultValue: 'latest')

    string(name: 'CONTAINER_PORT',             description: 'Container Port List (Seperate with Commas)',        defaultValue: '3000')
    string(name: 'CONTAINER_ENV',              description: 'Container Environment List (Seperate with Commas)', defaultValue: 'NODE_ENV=test')
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
              sh "git --version"
              sh "node --version"
              sh "npm --version"
            }
          }
        }

        stage("Agent: Docker") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              echo "Cleaning-up Environment"
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")

              echo "Setting-up Environment"
              if (params.KUBE_DEV_IS_OC) {
                kubeCMD = "oc-${params.KUBE_DEV_VERSION}"
              } else {
                kubeCMD = "kubectl-${params.KUBE_DEV_VERSION}"
              }
              
              echo "Checking-up Environment"
              sh "git --version"
              sh "docker --version"
              sh "${kubeCMD} version"
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

              echo "Get Latest Git Tag Name"
              gitTagName = sh (
                returnStdout: true,
                script: "git tag -l '*rc*' | cat | sort -V | tail -n 1 | xargs | tr -d ' ' | tr -d '\\n'"
              )
              println gitTagName

              echo "Match Git HEAD with Latest Git Tag Name"
              def gitMasterHead = sh (
                returnStdout: true,
                script: "git log | cat | head -n 1 | awk -F' ' '{print \$2}' | xargs | tr -d ' ' | tr -d '\\n'"
              )
              println gitMasterHead
              def gitTagHead = sh (
                returnStdout: true,
                script: "git log '${gitTagName}' | cat | head -n 1 | awk -F' ' '{print \$2}' | xargs | tr -d ' '| tr -d '\\n'"
              )
              println gitTagHead
              if (gitMasterHead == gitTagHead) {
                gitHeadMatch = true
              }
            }
          }
        }

        stage("Agent: Docker") {
          agent { label "jenkins-agent-docker-1" }
          steps {
            script {
              echo "Checking-out SCM"
              checkout scm

              echo "Get Latest Git Tag Name"
              gitTagName = sh (
                returnStdout: true,
                script: "git tag -l '*rc*' | sort -V | cat | tail -n 1 | xargs | tr -d ' ' | tr -d '\\n'"
              )
              println gitTagName

              echo "Match Git HEAD with Latest Git Tag Name"
              def gitMasterHead = sh (
                returnStdout: true,
                script: "git log | cat | head -n 1 | awk -F' ' '{print \$2}' | xargs | tr -d ' ' | tr -d '\\n'"
              )
              println gitMasterHead
              def gitTagHead = sh (
                returnStdout: true,
                script: "git log '${gitTagName}' | cat | head -n 1 | awk -F' ' '{print \$2}' | xargs | tr -d ' '| tr -d '\\n'"
              )
              println gitTagHead
              if (gitMasterHead == gitTagHead) {
                gitHeadMatch = true
              }
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
            sh "docker build -t '${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}' ."

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
            sh "docker run -d ${stringPort} ${stringEnv} --name '${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --rm '${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}'"
            sleep 5

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Containerize: Failed, Exiting Pipeline"
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")

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
                    script: "docker ps -a -f 'name=${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | cat | awk '{for(i=1;i<=NF;i++){tmp=match(\$i,/${portValue}/);if(tmp){print \$i}}}' | cut -d'-' -f1 | cut -d':' -f2 | xargs | tr -d ' ' | tr -d '\\n'"
                  )

                  curlRun("127.0.0.1:${exposedPort}", "http_code")
                }

                flagCheck = true
              } finally {
                if (flagCheck == false) {
                  echo "Container Test: Failed, Exiting Pipeline"
                  cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")

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
                    script: "docker ps -a -f 'name=${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | cat | awk '{for(i=1;i<=NF;i++){tmp=match(\$i,/${portValue}/);if(tmp){print \$i}}}' | cut -d'-' -f1 | cut -d':' -f2 | xargs | tr -d ' ' | tr -d '\\n'"
                  )

                  curlRun("127.0.0.1:${exposedPort}", "time_total")
                }

                flagCheck = true
              } finally {
                if (flagCheck == false) {
                  echo "Container Test: Failed, Exiting Pipeline"
                  cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")

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
                    script: "docker ps -a -f 'name=${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}' --format '{{.Ports}}' | cat | awk '{for(i=1;i<=NF;i++){tmp=match(\$i,/${portValue}/);if(tmp){print \$i}}}' | cut -d'-' -f1 | cut -d':' -f2 | xargs | tr -d ' ' | tr -d '\\n'"
                  )

                  curlRun("127.0.0.1:${exposedPort}", "size_download")
                }
                
                flagCheck = true
              } finally {
                if (flagCheck == false) {
                  echo "Container Test: Failed, Exiting Pipeline"
                  cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")

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

    stage("Integration Test") {
      agent { label "jenkins-agent-docker-1"}
      steps {
        script {
          try {
            flagCheck = false

            echo "Run Integration Test"
            sh "docker exec ${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG} npm run integration"
            
            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Integration Test: Failed, Exiting Pipeline"
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Integration Test: Success, Continuing Pipeline"
            }
          }
        }
      }
    }

    stage("Creating Image Tag With Git Tag Name") {
      agent { label "jenkins-agent-docker-1"}
      steps {
        script {
          try {
            flagCheck = false

            echo "Cleaning-up Docker"
            cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}")

            if (gitHeadMatch) {
              echo "Creating Image Tag With Git Tag Name"
              sh "docker tag ${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_DEV_IMAGE_NAME}:${params.DOCKER_DEV_IMAGE_TAG} ${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_DEV_IMAGE_NAME}:${gitTagName}"              
            } else {
              echo "Creating Image Tag With Git Tag Name: Skipping, Git Master HEAD Not Equal With Git Latest Tag HEAD"
            }

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Creating Image Tag With Git Tag Name: Failed, Exiting Pipeline"
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Creating Image Tag With Git Tag Name: Success, Continuing Pipeline"
            }
          }
        }
      }
    }

    stage("Pushing Image to Private Registry") {
      agent { label "jenkins-agent-docker-1" }
      steps {
        script {
          try {
            flagCheck = false

            echo "Logging-in to Private Registry"
            sh "docker login --username='${params.KUBE_DEV_NAMESPACE}' --password='${params.DOCKER_DEV_REGISTRY_TOKEN}' ${params.DOCKER_DEV_REGISTRY_URL}"

            echo "Pushing Image to Private Registry"
            sh "docker push '${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}'"
            if (gitHeadMatch) {
              sh "docker push '${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}'"
            }

            echo "Logging-out from Private Registry"
            sh "docker logout ${params.DOCKER_DEV_REGISTRY_URL}"

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Pushing Image to Private Registry: Failed, Exiting Pipeline"
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")
              sh "docker logout ${params.DOCKER_DEV_REGISTRY_URL}"

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Pushing Image to Private Registry: Success, Continuing Pipeline"
            }
          }
        }
      }
    }

    stage("Creating Image Stream Tag in Kubernetes Namespace") {
      agent { label "jenkins-agent-docker-1"}
      steps {
        script {
          try {
            flagCheck = false
            
            if (gitHeadMatch) {
              echo "Logging-in to Kubernetes Environment"
              sh "${kubeCMD} login ${params.KUBE_DEV_URL} --token=${params.KUBE_DEV_TOKEN}"

              echo "Selecting Active Project/Namespace in Kubernetes Environment"
              sh "${kubeCMD} project ${params.KUBE_DEV_NAMESPACE}"

              echo "Tagging Image Stream Tag with Git Tag Name in Kubernetes Environment"
              sh "${kubeCMD} tag ${params.DOCKER_DEV_IMAGE_NAME}:${gitTagName} ${params.DOCKER_DEV_IMAGE_NAME}:${gitTagName}"

              echo "Logging-out from Kubernetes Environment"
              sh "${kubeCMD} logout ${params.KUBE_DEV_URL}"
            } else {
              echo "Creating Image Stream Tag in Kubernetes Namespace: Skipping, Git Master HEAD Not Equal With Git Latest Tag HEAD"
            }

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Creating Image Stream Tag in Kubernetes Namespace: Failed, Exiting Pipeline"
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")
              sh "${kubeCMD} logout ${params.KUBE_DEV_URL}"

              currentBuild.result = 'FAILURE'
              sh "exit 1"
            } else {
              echo "Creating Image Stream Tag in Kubernetes Namespace: Success, Continuing Pipeline"
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
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")              
            }
          }
        }
      }
    }

  }
}