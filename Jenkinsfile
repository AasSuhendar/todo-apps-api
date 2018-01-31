node('jenkins-agent-nodejs-1') {
  
  try{

    stage('Cleaning Workspace') {
        echo 'Initializing for clean build...'
        deleteDir()
    }
    
    stage('Initialize') {
        echo 'Initializing...'
        def node = tool name: 'NodeJS-8.9', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
        env.PATH = "${node}/bin:${env.PATH}"
    }

    stage('Checkout SCM') {
        echo 'Checkout SCM...'
        checkout scm
    }
  
    try{

        stage('Check Env') {
            echo 'Checking Environment...'
            sh 'node -v'
            sh 'npm -v'
        }

        stage('Build') {
            echo 'Building Dependency...'
            sh 'npm install'
        }
        stage('Testing'){
            echo 'Testing...'
            sh 'npm test'
            sh 'npm run bdd'
        }
        
	    stage('Build In Openshift'){
            echo 'Build In Openshift...'
            openshiftBuild(namespace: 'demoplaycourt', buildConfig: 'todo-apps-api', showBuildLogs: 'true')
        }
	
    }finally{
        stage('Code Coverage'){
            junit 'junit.xml'
            step([$class: 'CukedoctorPublisher', featuresDir: './features', format: 'HTML', hideFeaturesSection: false, hideScenarioKeyword: false, hideStepTime: false, hideSummary: false, hideTags: false, numbered: true, sectAnchors: true, title: 'Living Documentation', toc: 'RIGHT'])
        }
        stage('SonarQube analysis') {
            def scannerHome = tool 'SonarQube Scanner';
            withSonarQubeEnv('SonarQube') {
            sh "${scannerHome}/bin/sonar-scanner"
        }

    }
    
  }

  }catch(e){

    throw e;
  }
}

