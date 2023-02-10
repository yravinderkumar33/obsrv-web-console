const fs = require('fs');
const path = require('path');
const source = path.join(__dirname, 'client', 'build');
const destination = path.join(__dirname, 'src', 'public');

fs.rename(source, destination, (error) => {
    
    if (error) {
        console.error(`Error copying build: ${error}`);
        // process.exit(1)
    }

    console.log(`Build copied to ${destination}`);
});