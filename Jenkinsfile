pipeline {
    agent any

    environment {
        AZURE_TENANT_ID = credentials('AZURE_TENANT_ID')
        AZURE_CLIENT_ID = credentials('AZURE_CLIENT_ID')
        AZURE_CLIENT_SECRET = credentials('AZURE_CLIENT_SECRET')
        RESOURCE_GROUP = 'cicd1'
        FUNCTION_APP_NAME = 'function1'
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
                // Install Azure CLI if not present
                bat '''
                    if not exist "C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2" (
                        echo Installing Azure CLI...
                        powershell -Command "Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\\AzureCLI.msi"
                        msiexec /i AzureCLI.msi /quiet
                    )
                '''
                
                // Create or update the zip file
                bat 'powershell -Command "Compress-Archive -Path * -DestinationPath function.zip -Force"'
                
                // Login to Azure and deploy
                bat '''
                    "C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\wbin\\az.cmd" login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% --tenant %AZURE_TENANT_ID%
                    "C:\\Program Files (x86)\\Microsoft SDKs\\Azure\\CLI2\\wbin\\az.cmd" functionapp deployment source config-zip --resource-group %RESOURCE_GROUP% --name %FUNCTION_APP_NAME% --src function.zip
                '''
            }
        }
    }
}