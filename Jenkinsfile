pipeline {
    agent any

    environment {
        REACT_APP_BACKEND_URL = credentials('REACT_APP_BACKEND_URL')
        RENDER_FRONTEND_DEPLOY_HOOK = credentials('RENDER_FRONTEND_DEPLOY_HOOK')
        RENDER_BACKEND_DEPLOY_HOOK = credentials('RENDER_BACKEND_DEPLOY_HOOK')
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/mdnaseeransari/chatbot-docker.git'
            }
        }

        stage('Install Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Install Backend') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }

        stage('Deploy to Render') {
            steps {
                bat 'curl -X POST %RENDER_FRONTEND_DEPLOY_HOOK%'
                bat 'curl -X POST %RENDER_BACKEND_DEPLOY_HOOK%'
            }
        }
    }

    post {
        success {
            echo '✅ Deployment successful!'
        }
        failure {
            echo '❌ Deployment failed!'
        }
    }
}