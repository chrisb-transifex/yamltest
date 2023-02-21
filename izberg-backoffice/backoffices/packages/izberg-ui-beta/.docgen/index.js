const path = require('path');
const fs = require('fs');
const reactDocgen = require('react-docgen');
const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');
const components = require('./components').components;
const template = require('./template').template;
const componentsPath = path.resolve(__dirname, '../src/');
const renderer = new ReactDocGenMarkdownRenderer({
    componentsBasePath: __dirname,
    template,
});

const gitHubLink =
    'https://github.com/izberg-marketplace/izberg-backoffice-ui/tree/master/packages/izberg-ui-beta/src/';

getComponents();

function getComponents() {
    components.forEach(component => {
        const componentPath = path.resolve(
            __dirname,
            componentsPath,
            component
        );
        generateComponentDoc(componentPath, component);
    });
}

function getGitHubLink(component) {
    return gitHubLink + component;
}

function removePropsToIgnore(doc) {
    const props = doc[0].props;
    Object.keys(props).forEach(propName => {
        const description = props[propName].description;
        if (description && description.includes('@ignore')) {
            delete props[propName];
        }
    });
}

function generateComponentDoc(componentPath, component) {
    fs.readFile(componentPath, (error, content) => {
        const doc = reactDocgen.parse(
            content,
            reactDocgen.resolver.findAllExportedComponentDefinitions
        );
        removePropsToIgnore(doc);
        const documentationPath = path.resolve(
            path.dirname(componentPath),
            'README' + renderer.extension
        );
        fs.writeFile(
            documentationPath,
            renderer.render(
                /* The path to the component, used for linking to the file. */
                getGitHubLink(component), // Workaround to display the GitHub link of the component
                /* The actual react-docgen AST */
                doc[0],
                /* Array of component ASTs that this component composes*/
                []
            ),
            err => {
                if (err) throw err;
            }
        );
    });
}
