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

        stage('') {
          steps {
            sh 'pwd | ls'
          }
        }

      }
    }

  }
}