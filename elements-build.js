const fs = require('fs-extra');  
const concat = require('concat');

(async function build() {
    const files = [
        './dist/eva-frontend/runtime.js',
        './dist/eva-frontend/polyfills.js',
        './dist/eva-frontend/polyfills-es5.js',
        './dist/eva-frontend/main.js'
    ];

    await fs.ensureDir('elements');
    await concat(files, 'elements/eva-frontend.js');
    await fs.copyFile(
        './dist/eva-frontend/styles.css',
        'elements/styles.css'
    );
})();