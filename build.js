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
    const command = 'cp -r ./client/build ./src/build'
    return execute({ command })
}

(async () => {
    try {
        await buildWebConsole({ path: clientPath });
        await copyBuildFiles();
    } catch (error) {
        console.log(error?.message);
        process.exit(0)
    }
})()




