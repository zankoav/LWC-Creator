// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const contentJS = (name) => `
import { LightningElement } from 'lwc';
import './${name.toLocaleLowerCase()}.scss';

export default class ${name} extends LightningElement {}`;

const contentUtilsJS = (name) => `export default class ${name} {}`;

const contentSCSS = (name) => `.${name.toLocaleLowerCase()}{}`;

const contentHTML = () => `<template></template>`;

const contentConstants = () => `$PRIMARY:#101010;`;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "lwc-creator" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let lwcComponent = vscode.commands.registerCommand('extension.createlwc', async () => {
        let cmpName = await vscode.window.showInputBox({ placeHolder: 'Name:' });
        if (cmpName) {
            const relativeName = cmpName.toLocaleLowerCase();
            const folderFrontendPath = vscode.workspace.workspaceFolders[0].uri.toString().split(":")[1] + '/frontend';
            const folderComponentsPath = folderFrontendPath + '/components';
            const folderCommonPath = folderFrontendPath + '/common';

            if (!fs.existsSync(folderFrontendPath)) {
                fs.mkdirSync(folderFrontendPath);
            }

            if (!fs.existsSync(folderComponentsPath)) {
                fs.mkdirSync(folderComponentsPath);
            }

            if (!fs.existsSync(folderCommonPath)) {
                fs.mkdirSync(folderCommonPath);
            }

            const folderMixinFile = path.join(folderCommonPath, 'constants.scss');
            const folderName = path.join(folderComponentsPath, relativeName);

            if (!fs.existsSync(folderMixinFile)) {
                fs.writeFile(folderMixinFile, contentConstants(), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create constants.scss file`);
                    }
                });
            }

            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName);
                fs.writeFile(path.join(folderName, `${relativeName}.js`), contentJS(cmpName), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create ${cmpName}.js file`);
                    }
                });

                fs.writeFile(path.join(folderName, `${relativeName}.scss`), contentSCSS(cmpName), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create ${cmpName}.scss file`);
                    }
                });

                fs.writeFile(path.join(folderName, `${relativeName}.html`), contentHTML(), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create ${cmpName}.html file`);
                    }
                });
            }
        }
    });

    let lwcUtils = vscode.commands.registerCommand('extension.createlwcutils', async () => {
        let cmpName = await vscode.window.showInputBox({ placeHolder: 'Name:' });
        if (cmpName) {
            const relativeName = cmpName.toLocaleLowerCase();
            const folderFrontendPath = vscode.workspace.workspaceFolders[0].uri.toString().split(":")[1] + '/frontend';
            const folderComponentsPath = folderFrontendPath + '/components';

            if (!fs.existsSync(folderFrontendPath)) {
                fs.mkdirSync(folderFrontendPath);
            }

            if (!fs.existsSync(folderComponentsPath)) {
                fs.mkdirSync(folderComponentsPath);
            }

            const folderName = path.join(folderComponentsPath, relativeName);

            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName);
                fs.writeFile(path.join(folderName, `${relativeName}.js`), contentUtilsJS(cmpName), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create ${cmpName}.js file`);
                    }
                });

                fs.writeFile(path.join(folderName, `${relativeName}.html`), contentHTML(), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create ${cmpName}.html file`);
                    }
                });
            }
        }
    });

    context.subscriptions.push(lwcComponent);
    context.subscriptions.push(lwcUtils);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
