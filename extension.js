// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const contentJS = (name, styleFormat) => `
import { LightningElement } from 'lwc';
import './${lowerCaseFirst(name)}.${styleFormat}';

export default class ${name} extends LightningElement {}`;

const contentUtilsJS = (name) => `export default class ${name} {}`;

const contentStyle = () => `/* Styles here */`;

const contentHTML = (name) => `<template>${name}</template>`;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let defaultFolder = vscode.workspace.getConfiguration('lwc-creator').defaultComponentsFolder;
    let defaultStyleFormat = vscode.workspace.getConfiguration('lwc-creator').defaultStyleFormat;
    const pathDir = vscode.workspace.workspaceFolders[0].uri.fsPath;
    defaultFolder = defaultFolder || '';
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // console.log('Congratulations, your extension "lwc-creator" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let lwcComponent = vscode.commands.registerCommand('extension.createlwc', async () => {
        let cmpName = await vscode.window.showInputBox({ placeHolder: 'Name:' });
        cmpName = cmpName.replace(" ", "");
        cmpName = upperCaseFirst(cmpName);
        if (cmpName) {
            const relativeName = lowerCaseFirst(cmpName);
            const folderName = path.join(pathDir, defaultFolder, relativeName);
            await fs.promises.mkdir(folderName, { recursive: true }).catch(console.error);
            const jsFileName = path.join(folderName, `${relativeName}.js`);
            fs.writeFile(jsFileName, contentJS(cmpName, defaultStyleFormat), err => {
                if (err) {
                    vscode.window.showErrorMessage(`Error! Can not create ${relativeName}.js file`);
                } else {
                    vscode.window.showInformationMessage(`${cmpName} has created successful !`);
                    vscode.window.showTextDocument(vscode.Uri.file(jsFileName));
                }
            });

            fs.writeFile(path.join(folderName, `${relativeName}.${defaultStyleFormat}`), contentStyle(), err => {
                if (err) {
                    vscode.window.showErrorMessage(`Error! Can not create ${relativeName}.${defaultStyleFormat} file`);
                }
            });

            fs.writeFile(path.join(folderName, `${relativeName}.html`), contentHTML(cmpName), err => {
                if (err) {
                    vscode.window.showErrorMessage(`Error! Can not create ${relativeName}.html file`);
                }
            });


        }
    });

    let lwcUtils = vscode.commands.registerCommand('extension.createlwcutils', async () => {
        let cmpName = await vscode.window.showInputBox({ placeHolder: 'Name:' });
        cmpName = upperCaseFirst(cmpName);
        if (cmpName) {
            const relativeName = lowerCaseFirst(cmpName);
            const folderName = path.join(pathDir, defaultFolder, relativeName);

            await fs.promises.mkdir(folderName, { recursive: true }).catch(console.error);
            const jsFileName = path.join(folderName, `${relativeName}.js`);
            fs.writeFile(jsFileName, contentUtilsJS(cmpName), err => {
                if (err) {
                    vscode.window.showErrorMessage(`Error! Can not create ${relativeName}.js file`);
                } else {
                    vscode.window.showInformationMessage(`${cmpName} has created successful !`);
                    vscode.window.showTextDocument(vscode.Uri.file(jsFileName));
                }
            });

            fs.writeFile(path.join(folderName, `${relativeName}.html`), contentHTML(cmpName), err => {
                if (err) {
                    vscode.window.showErrorMessage(`Error! Can not create ${relativeName}.html file`);
                }
            });
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

function lowerCaseFirst(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

function upperCaseFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
