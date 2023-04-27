const fs = require('fs');
const path = require('path');
const rimRaf = require('rimraf');
const { exec } = require('child_process');

const clientPath = path.join(__dirname, 'client');

function execute({ command, options }) {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            console.log({ error, stderr, stdout });
            if (error) {
                reject(error);
            } else if (stderr) {
                resolve(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}

const buildWebConsole = async ({ path }) => {
    const options = { cwd: path };
    await execute({ command: 'yarn install --silent', options });
    await execute({ command: 'yarn build', options });
}

const copyBuildFiles = () => {
    const command = 'cp -r ./client/build/* ./src/public/'
    return execute({ command })
}

(async () => {
    try {
        await rimRaf(['./client/node_modules']);
        await buildWebConsole({ path: clientPath });
        await copyBuildFiles();
        await rimRaf('./client/node_modules');
    } catch (error) {
        console.log(error?.message);
        process.exit(0)
    }
})()




