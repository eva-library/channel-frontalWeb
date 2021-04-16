node {

    def storageCredentialId = 'devzurichchatbot'

    stage('Checkout') {
        checkout scm
    }

    def props = readJSON file: 'package.json'
    def name = props['name']
    def pathName = "dist/${name}/"

    stage('Build') {
        docker.image('node:10-alpine').inside {
            withEnv([
                    /* Override the npm cache directory to avoid: EACCES: permission denied, mkdir '/.npm' */
                    'npm_config_cache=npm-cache',
                    /* set home to our current directory because other bower
                    * nonsense breaks with HOME=/, e.g.:
                    * EACCES: permission denied, mkdir '/.config'
                    */
                    'HOME=.',
                ]) {
                    sh 'npm i -g @angular/cli@7.3.9'
                    sh 'npm install'
                    sh 'ng build --prod'
                    sh 'ls -al'
                }

        }
    }

    stage('Deploy') {
        // Apply the deployments to AKS.
        echo "Deploy ${pathName}"
        dir(pathName) {
            sh 'ls -al'
            azureUpload storageCredentialId: storageCredentialId,
                        storageType: 'blobstorage',
                        containerName: '$web',
                        cleanUpContainerOrShare: true,
                        filesPath: '**',
                        blobProperties: [
                            detectContentType: true
                            ]
            azureUpload storageCredentialId: storageCredentialId,
                        storageType: 'blobstorage',
                        containerName: '$web',
                        cleanUpContainerOrShare: false,
                        filesPath: 'index.html',
                        blobProperties: [
                            cacheControl: 'max-age=100',
                            contentType: 'text/html'
                        ]
        }
    }

}
