pipeline {
    agent any
    
    environment {
        AZURE_FUNCTIONAPP_NAME = 'skurianfunction2025'
        AZURE_RESOURCE_GROUP = 'cicd'
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
                    try {
                        echo 'Running tests...'
                        dir('HelloWorldFunction') {
                            sh 'npm test'
                        }
                    } catch (Exception e) {
                        echo 'Tests failed but continuing with deployment'
                        // You can choose to fail the build here by uncommenting the next line
                        // error('Test stage failed')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    echo 'Deploying to Azure...'
                    dir('HelloWorldFunction') {
                        sh 'zip -r function.zip . -x "node_modules/*"'
                        withCredentials([azureServicePrincipal('Azure_Credentials')]) {
                            sh '''
                                az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET -t $AZURE_TENANT_ID
                                az functionapp deployment source config-zip \
                                    --resource-group ${AZURE_RESOURCE_GROUP} \
                                    --name ${AZURE_FUNCTIONAPP_NAME} \
                                    --src function.zip
                            '''
                        }
                    }
                }
            }
        }
    }
} 