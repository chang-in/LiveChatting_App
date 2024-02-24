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

        stage('Test') {
          steps {
            sh 'pwd | ls'
          }
        }

      }
    }

    stage('BE_build') {
      parallel {
        stage('BE_build') {
          steps {
            sh 'cd backend | docker build --tag dhckddls12/fastapi_be:${env.DOCKER_BACKEND_VERSION} | echo "build success(BE)"'
          }
        }

        stage('FE_build') {
          steps {
            sh 'cd frontend | docker build --tag dhckddls12/react_fe:${DOCKER_FRONTEND_VERSION} | echo "build success(FE)"'
          }
        }

      }
    }

  }
  environment {
    DOCKER_FRONTEND_VERSION = '1.0'
    DOCKER_BACKEND_VERSION_VERSION = '1.0'
  }
}