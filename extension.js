// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const contentJS = (name) => `
import { LightningElement, track } from 'lwc';
import '${name.toLocaleLowerCase()}.scss';

export default class ${name} extends LightningElement {

}`;
const contentSCSS = () => `@import './../../common/mixins';`;
const contentHTML = () => `<template></template>`;

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
    let disposable = vscode.commands.registerCommand('extension.createlwc', async () => {
        let cmpName = await vscode.window.showInputBox({ placeHolder: 'Name:' });
        if (cmpName) {
            const relativeName = cmpName.toLocaleLowerCase();
            const folderPath = vscode.workspace.workspaceFolders[0].uri.toString().split(":")[1] + '/frontend/components';
            const folderName = path.join(folderPath, relativeName);
            if (!fs.existsSync(folderName)) {
                fs.mkdirSync(folderName);
                fs.writeFile(path.join(folderName, `${relativeName}.js`), contentJS(cmpName), err => {
                    if (err) {
                        return vscode.window.showErrorMessage(`Error! Can not create ${cmpName}.js file`);
                    }
                });

                fs.writeFile(path.join(folderName, `${relativeName}.scss`), contentSCSS(), err => {
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

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
