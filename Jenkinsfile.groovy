pipeline {
    agent any
    
    environment {
        AZURE_SUBSCRIPTION_ID = '9758b5e0-f199-45dd-8720-df539b720ac9'
        RESOURCE_GROUP = 'cicd'
        FUNCTION_APP_NAME = 'skurianfunction2025'
    }
    
    stages {
        stage('Build') {
            steps {
                script {
                    echo 'Building the application...'
                    dir('HelloWorldFunction') {
                        sh 'npm install'
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    echo 'Running tests...'
                    dir('HelloWorldFunction') {
                        sh 'npm test'
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying to Azure...'
                    dir('HelloWorldFunction') {
                        // Zip the function app
                        sh 'zip -r function.zip . -x "node_modules/*"'
                        
                        // Deploy to Azure
                        sh """
                            az functionapp deployment source config-zip \
                            --resource-group ${RESOURCE_GROUP} \
                            --name ${FUNCTION_APP_NAME} \
                            --src function.zip
                        """
                    }
                }
            }
        }
    }
} 