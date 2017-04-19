// The GIT repository for this pipeline lib is defined in the global Jenkins setting
@org.jenkinsci.plugins.workflow.libs.Library('jenkins-pipeline-library')
import com.gentics.*

// Make the helpers aware of this jobs environment
JobContext.set(this)


final def sshAgent             = '601b6ce9-37f7-439a-ac0b-8e368947d98d'
final def mattermostChannel    = "#jenkins"


String version = null

pipeline {
    agent {
        label 'dockerSlave'
    }

    stages {
        stage('Checkout') {
            steps {
                sh "rm -rf *"
                checkout scm
            }
        }

        stage('Determine version') {
            steps {
                script {
                    version = env.gitlabSourceBranch.replace('refs/tags/v', '');
                    currentBuild.description = 'NPM package for v' + version
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sshagent([sshAgent]) {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                sshagent([sshAgent]) {
                    sh 'node ./config/jenkins-build.js build ' + version
                }
            }
        }

        stage('Publish') {
            steps {
                sshagent([sshAgent]) {
                    sh 'node ./config/jenkins-build.js publish ' + version

                    script {
                        currentBuild.result = 'SUCCESS'
                    }
                }
            }
        }
    }

    post {
        always {
            // Cleanup
            step([$class: 'WsCleanup'])

            script {
                String customMessage = null

                if (currentBuild.result == 'SUCCESS') {
                    customMessage = '[Gentics UI Core v' + version + '](' +
                        'https://git.gentics.com/psc/gentics-ui-core-npm-package/tags/v' + version + ') released.'
                } else {
                    customMessage = '[Gentics UI Core v' + version + ' failed to build](' +
                        currentBuild.absoluteUrl + 'console).'
                }

                // Notify in Mattermost
                MattermostHelper.sendStatusNotificationMessage(mattermostChannel, customMessage)
            }
        }
    }
}
