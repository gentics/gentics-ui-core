//
//  Pipeline script that builds/publishes gentics-ui-core as an npm package to a second repository.
//
//  Called by Jenkins in this order:
//      jenkins-build.js build 99.99.99
//      jenkins-build.js publish 99.99.99
//

/** The git repository where the built package and tags should be pushed to. */
const packageRepo = 'git@git.gentics.com:psc/gentics-ui-core-npm-package.git';

/** Set when testing/debugging the jenkins build pipeline. */
const dryRun = false;

main();

function main() {
    const command = process.argv[2];
    const version = process.argv[3];

    console.log(`
    ========================================================================
    Build script preparing to ${command} version ${version}
    ========================================================================
    `);

    if (!/^\d+\.\d+\.\d+$/.test(version)) {
        console.error(`Invalid version: ${version}`);
        process.exit(1);
    }

    switch (command) {
        case 'build': return build(version);
        case 'publish': return publish(version);
        default:
            console.error(`Invalid pipeline command "${command}".`);
            process.exit(1);
    }
}

function build(versionToBuild) {
    const versionFromPackageJson = require('../package.json').version;

    if (versionFromPackageJson !== versionToBuild) {
        console.log(`Version in package.json differs from version tag, aborting.`);
        console.log(`  package.json version: ${versionFromPackageJson}`);
        console.log(`  tag version: ${versionToPublish}`);
        throw new Error('Version in package.json differs from version tag, aborting.');
    }

    console.log('Building...');

    Promise.resolve()

        // Ensure all expected files exist
        .then(() => filesMustExist([
            'package.json',
            'npm-shrinkwrap.json',
            'gulpfile.js',
            '.npmignore'
        ]))

        // Build ui-core from source to package
        .then(() => runCommand('node ./node_modules/gulp/bin/gulp.js package'))

        .catch(err => {
            console.error(err);
            process.exitCode = 1;
        });
}

function publish(versionToPublish) {
    let baseVersion;
    let isNewestVersion;
    let commitMessage;

    Promise.resolve()

        // Ensure all expected files exist
        .then(() => filesMustExist([
            'package.json',
            'npm-shrinkwrap.json'
        ]))

        .then(() => console.log('Fetching existing tags...'))
        .then(fetchVersionTagsInPackageRepo)
        .then(versionTags => {
            console.log('Existing version tags: ' + versionTags.join(' '));

            // Find best matching version for current release.
            // e.g. if we have version 5.1.0 and 6.0.0, pushing tag 5.1.1 bases its changes on 5.1.0
            baseVersion = findMatchingRecentVersion(versionToPublish, versionTags);
            console.log(`Committing changes of ${versionToPublish} based on ${baseVersion}`);

            // We only push master and `current` tag if this is the newest version
            isNewestVersion = !versionTags.some(existingVersion => versionIsOlder(versionToPublish, existingVersion));
        })

        // Move the changes in dist/ to a temporary folder, we move them back after checking out the base version
        .then(() => rename('dist', 'temporary-dist-folder'))

        // Tell git to ignore the temporary folder
        .then(() => appendToFile('.git/info/exclude', '\ntemporary-dist-folder\n'))

        // Checkout the base version
        .then(() => console.log(`Moving to existing tag ${baseVersion} to commit package differences...`))
        .then(() => runCommand(`git reset --mixed refs/packagetags/v${baseVersion}`))

        // Use the dist folder of our previously built version, not the base version
        .then(() => deleteFolderAndContents('dist'))
        .then(() => rename('temporary-dist-folder', 'dist'))

        // We needed npm-shrinkwrap.json to install the correct dependencies, but should not include it in the package
        .then(() => deleteFiles(['npm-shrinkwrap.json', '.gitignore']))

        // Use the .npmignore to tell git what files to ignore
        .then(() => copyFile('.npmignore', '.gitignore'))

        // Build the commit message from the commit referenced by the new tag
        .then(() => buildCommitMessage(versionToPublish))
        .then(msg => { commitMessage = msg; })

        // Add and commit all files which changed and are not ignored by .npmignore
        .then(() => runCommand('git add .'))
        .then(() => runCommand(`git commit -m '${commitMessage}'`))

        // Tag the new commit
        .then(() => runCommand(`git tag -a -m 'Version ${versionToPublish} as npm package' new_version_tag`))

        // Push the new tag to the package repository
        .then(() => {
            if (dryRun) {
                console.log(`Would now push tag v${versionToPublish} to package repo`);
            } else {
                return runCommand(`git push -f ${packageRepo} refs/tags/new_version_tag:refs/tags/v${versionToPublish}`);
            }
        })

        // Push "master" and "latest" to the package repository if the new version is the highest
        .then(() => {
            if (!isNewestVersion) {
                console.log(`Not pushing "master" and "latest" - v${versionToPublish} is not the newest version.`);
            } else if (dryRun) {
                console.log(`Would now push "master" and "latest" to package repo`);
            } else {
                console.log(`Pushing "master" and "latest" to package repo...`);
                return runCommand(`git push -f ${packageRepo} HEAD:refs/heads/master refs/tags/new_version_tag:refs/tags/latest`)
                    .then(() => console.log(`Pushed "master" and "latest" to package repo.`));
            }
        })
        .catch(err => {
            console.error(err);
            process.exitCode = 1;
        });
}

/** Fetch tags from package repo into a namespace, e.g. tag v1.0.0 to /refs/packagetags/v1.0.0 */
function fetchVersionTagsInPackageRepo() {
    return runCommand(`git fetch ${packageRepo} +refs/tags/*:refs/packagetags/*`)
        .then(() => runCommand(`git show-ref`))
        .then(allRefs => allRefs
            .split('\n')
            .filter(line => line.indexOf(' refs/packagetags/v') >= 0)
            .map(line => line.replace(/^.+ refs\/packagetags\/v/, '')));
}

/**
 * Find the best-matching most recent version.
 * @example
 * findMatchingRecentVersion('3.1.1', ['4.1.1', '4.1.0', '4.0.0', '3.1.0', '3.0.0'])
 *     => '3.1.0'
 */
function findMatchingRecentVersion(version, previousVersions) {
    return previousVersions
        .filter(oldVersion => versionIsOlder(oldVersion, version))
        .sort((a, b) => a === b ? 0 : versionIsOlder(a, b) ? 1 : -1)[0];
}

function versionIsOlder(oldVersion, newVersion) {
    const partsOld = oldVersion.replace(/^v/, '').split('.').map(str => Number(str));
    const partsNew = newVersion.replace(/^v/, '').split('.').map(str => Number(str));
    return partsOld[0] < partsNew[0]
        || partsOld[0] === partsNew[0] && partsOld[1] < partsNew[1]
        || partsOld[0] === partsNew[0] && partsOld[1] === partsNew[1] && partsOld[2] < partsNew[2];
}

function buildCommitMessage(version) {
    // Format git log output as 'hash \n author <email> \n date'
    return runCommand(`git log refs/tags/v${version} -1 --pretty=format:"%H%n%aN <%aE>%n%aD"`)
        .then(sourceCommitInfo => {
            const [hash, author, date] = sourceCommitInfo.split('\n');
            return [
                'Commit npm package of v' + version,
                '',
                'Original Commit: ' + hash,
                'Original Author: ' + author,
                'Original Date:   ' + date
            ].join('\n');
        });
}

function copyFile(source, destination) {
    return new Promise((resolve, reject) => {
        const inputStream = require('fs').createReadStream(source);
        inputStream.on('error', reject);

        const outputStream = require('fs').createWriteStream(destination);
        outputStream.on('error', reject);
        outputStream.on('close', resolve);
        inputStream.pipe(outputStream);
    });
}

/** Move/rename a file or folder. **/
function rename(oldPath, newPath) {
    oldPath = require('path').resolve(__dirname, '..', oldPath);
    newPath = require('path').resolve(__dirname, '..', newPath);

    return new Promise((resolve, reject) => {
        require('fs').rename(oldPath, newPath, promiseCallback(resolve, reject));
    });
}

function appendToFile(filename, contents) {
    return new Promise((resolve, reject) => {
        const absoluteFilename = require('path').resolve(__dirname, '..', filename);
        require('fs').appendFile(absoluteFilename, contents, { encoding: 'utf8' }, promiseCallback(resolve, reject));
    });
}

function deleteFiles(filenames) {
    return Promise.resolve()
        .then(() => Promise.all(
            filenames.map(filename => new Promise((resolve, reject) => {
                require('fs').unlink(require('path').join(__dirname, '..', filename), promiseCallback(resolve, reject));
            }))
        ));
}

function deleteFolderAndContents(path) {
    return new Promise((resolve, reject) => {
        const absolutePath = require('path').join(__dirname, '..', path);
        require('rimraf')(absolutePath, promiseCallback(resolve, reject));
    });
}

function filesMustExist(filePaths) {
    return Promise.all(filePaths.map(path =>
        new Promise((resolve, reject) => {
            const absolutePath = require('path').join(__dirname, '..', path);
            require('fs').exists(absolutePath, exists => {
                if (exists) {
                    resolve();
                } else {
                    reject(new Error('File expected but does not exist: ' + path));
                }
            });
        })
    ));
}

/** Utility function to wrap node's callback APIs in promises. */
function promiseCallback(resolve, reject) {
    return function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    }
}

/** Run a command in the project root directory and capture its output. */
function runCommand(command) {
    const exec = require('child_process').exec;
    const workingDirectory = require('path').resolve(__dirname, '..');

    return new Promise((resolve, reject) => {
        exec(command, { cwd: workingDirectory, encoding: 'utf8' }, (err, stdout, stderr) => {
            if (err) {
                console.error(err.message);
                console.log('stdout: ', stdout);
                console.log('stderr: ', stderr);
                process.exitCode = 1;
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}

