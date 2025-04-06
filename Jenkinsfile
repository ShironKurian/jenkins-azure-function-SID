pipeline {
    agent any

    environment {
        AZURE_CLIENT_ID     = credentials('AZURE_CLIENT_ID')
        AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
        AZURE_TENANT_ID     = credentials('AZURE_TENANT_ID')
        RESOURCE_GROUP      = 'cicd1'
        FUNCTION_APP_NAME   = 'function1'
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies...'
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                bat 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying to Azure...'
                bat '''
                    powershell -Command "Compress-Archive -Path * -DestinationPath function.zip"
                    az login --service-principal -u $env:AZURE_CLIENT_ID -p $env:AZURE_CLIENT_SECRET --tenant $env:AZURE_TENANT_ID
                    az functionapp deployment source config-zip --resource-group $env:RESOURCE_GROUP --name $env:FUNCTION_APP_NAME --src function.zip
                '''
            }
        }
    }
}