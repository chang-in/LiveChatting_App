pipeline {
  agent any
  stages {
    stage('Checkout Code') {
      parallel {
        stage('Checkout Code') {
          steps {
            git(url: 'https://github.com/mangji12/DevOpsChatApp.git', branch: 'main')
          }
        }

        stage('whoami') {
          steps {
            sh 'whoami'
          }
        }

      }
    }

    stage('BE_build') {
      steps {
        sh 'cd backend; sudo docker buildx build --tag dhckddls12/fastapi_be:1.0 .| echo "build success(BE)"'
      }
    }

    stage('FE_build') {
      steps {
        sh 'cd frontend; sudo docker buildx build --tag dhckddls12/react_fe:${DOCKER_FRONTEND_VERSION} .| echo "build success(FE)"'
      }
    }

  }
  environment {
    DOCKER_FRONTEND_VERSION = '1.0'
    DOCKER_BACKEND_VERSION = '1.0'
  }
}