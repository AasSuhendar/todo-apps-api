// global variable
def flagCheck     = false
def gitTagName    = ""
def gitHeadMatch  = false
def containerPort = ""
def containerEnv  = ""

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
      cleanUpWorkspace()
    }
  }  
}

// pipeline declarative
pipeline {
  parameters {
    string(name: 'KUBE_DEV_NAMESPACE',         description: 'Kubernetes Development Namespace',                  defaultValue: 'demoplaycourt')
    string(name: 'DOCKER_DEV_REGISTRY_URL',    description: 'Docker Development Registry URL',                   defaultValue: 'docker-registry-default.apps.playcourt.id')
    string(name: 'DOCKER_DEV_REGISTRY_TOKEN',  description: 'Docker Development Registry Token',                 defaultValue: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZW1vcGxheWNvdXJ0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6ImplbmtpbnMtdG9rZW4ta25iOWIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiamVua2lucyIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6IjNhMjMxODZlLTYwZGUtMTFlOC05YWNkLTAwNTA1NjhjNTZlNSIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDpkZW1vcGxheWNvdXJ0OmplbmtpbnMifQ.cBMVuXki1Yhuy2jN-WUi8OeGofLOASo_MtV5ICiY-2RAAGVDzcgbdMABmqnmHCi4UAwyTbEkRKSc-27U_Ed5_uaxW1H4rXbYhuk_SDUgTBXrlo578L5CDTUO5s_IJ6nZyMsqEBm-kMObux2rMTFUFb9qUG7bSLEp5oa0Nt1rMyWjr80zxNIDd9h0vk3QbIWBgRO12t4PrOK8xJSaPh86_PQ-Ehrz3R-RvokHQdlRX_Rx1_1NxyCNUBTfN_NplbQVcwtY1AdHBzLoXgioqTJhSEb8jVoRfIf-BUH8v5hBC2n34dFbNJsGXr1n32Ctm4gikD6RFGXyR_7OsEP-oC2RAg')
    string(name: 'DOCKER_IMAGE_NAME',          description: 'Docker Image Name',                                 defaultValue: 'todo-apps-api')
    string(name: 'DOCKER_IMAGE_TAG',           description: 'Docker Image Tag',                                  defaultValue: 'latest')

    string(name: 'CONTAINER_PORT',             description: 'Container Port List (Seperate with Commas)',        defaultValue: '3000')
    string(name: 'CONTAINER_ENV',              description: 'Container Environment List (Seperate with Commas)', defaultValue: 'NODE_ENV=test')

    string(name: 'GIT_TAG_SEARCH',             description: 'Search for Git Tag Record',                         defaultValue: 'rc')

    string(name: 'JOB_NOTIF_MAIL_DST',         description: 'Jenkins Job Mail Notification Destination',         defaultValue: '')
    string(name: 'JOB_NEXT_NAME',              description: 'Jenkins Next Job Name',                             defaultValue: '')
    string(name: 'JOB_NEXT_TOKEN',             description: 'Jenkins Next Job Token',                            defaultValue: '')
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

              echo "Checking-up Environment"
              sh "git --version"
              sh "docker --version"
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
                script: "git tag -l '*${params.GIT_TAG_SEARCH}*' | cat | sort -V | tail -n 1 | xargs | tr -d ' ' | tr -d '\\n'"
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
                script: "git tag -l '*${params.GIT_TAG_SEARCH}*' | sort -V | cat | tail -n 1 | xargs | tr -d ' ' | tr -d '\\n'"
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
            sh "docker cp ${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}:/usr/src/app/cucumber.json ."
            livingDocs featuresDir: 'cucumber.json'

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

    stage("Pushing Image to Private Registry") {
      agent { label "jenkins-agent-docker-1" }
      steps {
        script {
          try {
            flagCheck = false

            echo "Cleaning-up Docker"
            cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}")

            echo "Logging-in to Private Registry"
            sh "docker login --username='${params.KUBE_DEV_NAMESPACE}' --password='${params.DOCKER_DEV_REGISTRY_TOKEN}' ${params.DOCKER_DEV_REGISTRY_URL}"

            if (gitHeadMatch) {
              echo "Creating Image Tag With Git Tag Name"
              sh "docker tag ${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG} ${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}"
            } else {
              echo "Creating Image Tag With Git Tag Name: Skipping, Git Master HEAD Not Equal With Git Latest Tag HEAD"
            }

            echo "Pushing Image to Private Registry"
            sh "docker push '${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}'"
            if (gitHeadMatch) {
              sh "docker push '${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}'"
            }

            echo "Logging-out from Private Registry"
            sh "docker logout ${params.DOCKER_DEV_REGISTRY_URL}"

            if (gitHeadMatch && ! params.JOB_NOTIF_MAIL_DST.equals('') && ! params.JOB_NEXT_NAME.equals('') && ! params.JOB_NEXT_TOKEN.equals('')) {
              echo "Sending Mail Notification for Pushed Image with New Tag"
              emailext(
                to: "${params.JOB_NOTIF_MAIL_DST}",
                subject: "Jenkins ${env.JOB_NAME}: An Image With New Tag Has Been Pushed",
                body: """
                  <html>
                    <body>
                      <h3>Congratulation!</h3>
                      <h4>An Image With New Tag Has Been Pushed</h4>
                      <br/>
                      <p>
                        Information :<br/>
                        <table border='0'>
                          <tr>
                            <td>Registry URL</td>
                            <td>: <strong>${params.DOCKER_DEV_REGISTRY_URL}</strong></td>
                          </tr>                        
                          <tr>
                            <td>Image Name</td>
                            <td>: <strong>${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}</strong></td>
                          </tr>
                        </table>
                      </p>
                      <br/>
                      <p>
                        Please click the link below to promote the image, thank you.<br/>
                        <a href='https://jenkins.playcourt.id/job/${params.JOB_NEXT_NAME}/buildWithParameters?token=${params.JOB_NEXT_TOKEN}&DOCKER_SRC_IMAGE_TAG=${gitTagName}&IS_PROD=false'>
                          <strong>Promote Image: ${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}</strong>
                        </a>
                      </p>
                    </body>
                  </html>
                """
              )
            }

            flagCheck = true
          } finally {
            if (flagCheck == false) {
              echo "Pushing Image to Private Registry: Failed, Exiting Pipeline"
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
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
              cleanUpDocker("", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${gitTagName}")
              cleanUpDocker("${params.KUBE_DEV_NAMESPACE}-${params.DOCKER_IMAGE_NAME}-${params.DOCKER_IMAGE_TAG}", "${params.DOCKER_DEV_REGISTRY_URL}/${params.KUBE_DEV_NAMESPACE}/${params.DOCKER_IMAGE_NAME}:${params.DOCKER_IMAGE_TAG}")
            }
          }
        }
      }
    }

  }
}