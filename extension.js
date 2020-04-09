const UTILS = require('./root/utils');
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const contentJS = (name, styleFormat) => `
import { LightningElement } from 'lwc';
import './${UTILS.lowerCaseFirst(name)}.${styleFormat}';

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

    let lwcComponent = vscode.commands.registerCommand('extension.createlwc', async () => {
        let cmpName = await vscode.window.showInputBox({ placeHolder: 'Name:' });
        cmpName = cmpName.replace(" ", "");
        cmpName = UTILS.upperCaseFirst(cmpName);
        if (cmpName) {
            const relativeName = UTILS.lowerCaseFirst(cmpName);
            const folderName = path.join(pathDir, defaultFolder, relativeName);
            const isExists = fs.existsSync(folderName);
            if (isExists) {
                vscode.window.showInformationMessage(`Oops! ${cmpName} had been created earlier`);
                return;
            }
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
        cmpName = UTILS.upperCaseFirst(cmpName);
        if (cmpName) {
            const relativeName = UTILS.lowerCaseFirst(cmpName);
            const folderName = path.join(pathDir, defaultFolder, relativeName);
            const isExists = fs.existsSync(folderName);
            if (isExists) {
                vscode.window.showInformationMessage(`Oops! ${cmpName} had been created earlier`);
                return;
            }
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
