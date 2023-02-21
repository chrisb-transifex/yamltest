const path = require('path');
const fs = require('fs');
const components = require('./components').components;
const componentsPath = path.resolve(__dirname, '../src/');
const docsPath = path.resolve(__dirname, '../docs/components');

getComponents();

function getComponents() {
    components.forEach(component => {
        const componentPath = path.resolve(
            __dirname,
            componentsPath,
            component
        );
        copyComponentDoc(componentPath);
    });
}

function copyComponentDoc(componentPath) {
    const documentationPath = path.resolve(
        path.dirname(componentPath),
        'README.md'
    );
    const componentName = path
        .dirname(componentPath)
        .split(path.sep)
        .pop();
    const target = path.resolve(docsPath, `${componentName}.md`);
    if (!fs.existsSync(docsPath)) {
        fs.mkdirSync(docsPath);
    }
    fs.copyFile(documentationPath, target, err => {
        if (err) throw err;
    });
}
