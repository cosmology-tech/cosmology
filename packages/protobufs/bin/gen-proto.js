import generate from '@babel/generator';
import * as t from '@babel/types';
import traverse from '@babel/traverse';
import { parse } from '@babel/parser';
import { readFileSync, writeFileSync } from 'fs';
import { sync as glob } from 'glob';
import path from 'path';
import { sync as mkdirp } from 'mkdirp';

const PARENTPATH = path.resolve(path.join(__dirname, '..'));
const PROTOFOLDER = 'out/proto';
const OUTPROTOFOLDER = 'src/proto';
const OUTPATH = path.resolve(PARENTPATH, OUTPROTOFOLDER);
const PROTOPATH = path.resolve(path.join(PARENTPATH, PROTOFOLDER));


const main = async () => {

    const paths = glob(PROTOPATH + '/**/*.ts')
        // .filter(a => a.match(/v1beta/))
        // .filter(a => a.match(/tx\.ts/))

    const codez = [];

    paths.forEach(async tsFile => {

        const code = readFileSync(tsFile, 'utf-8');
        const interfaces = [];

        const plugins = [
            "objectRestSpread",
            "classProperties",
            "optionalCatchBinding",
            "asyncGenerators",
            "decorators-legacy",
            "typescript",
            "dynamicImport",
        ];

        let currentPackage = '';

        const ast = parse(code, {
            sourceType: "module",
            plugins
        });

        const importStmts = [];
        const exportStmts = [];

        const bodyStmts = [];

        traverse(ast, {
            enter(path) {
                if (path?.parentPath?.node?.type === 'Program') {
                    if (t.isExportDeclaration(path.node)) return;
                    if (t.isImportDeclaration(path.node)) return;
                    if (t.isFunctionDeclaration(path.node)) return;
                    if (t.isIfStatement(path.node)) return;
                    if (t.isTSTypeAliasDeclaration(path.node)) return;
                    if (t.isTSInterfaceDeclaration(path.node)) return;
                    if (t.isVariableDeclaration(path.node)) return;
                    console.log(path.node.type);
                    console.log('program parent');
                    bodyStmts.push(path.node);
                }
            },

            ImportDeclaration(path) {
                importStmts.push(path.node);
                path.remove();
            },

            ExportNamedDeclaration(path) {
                let foundit = false;
                if (path.node.declaration.type === 'VariableDeclaration') {
                    const variable = path.node.declaration;
                    if (variable.declarations.length && variable.declarations[0].type === 'VariableDeclarator') {
                        const ident = variable.declarations[0];
                        if (ident?.id?.name === 'protobufPackage') {
                            foundit = true;
                        }
                    }
                }
                if (!foundit) exportStmts.push(path.node); 
                if (!foundit) bodyStmts.push(path.node); 
            },

            FunctionDeclaration (path) {
                if (path?.parentPath?.node?.type === 'Program') {
                    bodyStmts.push(path.node);
                }   
            },

            VariableDeclaration (path) {
                if (path?.parentPath?.node?.type === 'Program') {
                    bodyStmts.push(path.node);
                }   
            },

            TSInterfaceDeclaration (path) {
                interfaces.push(path.node);

                if (path?.parentPath?.node?.type === 'Program') {
                    bodyStmts.push(path.node);
                }   
            },

            IfStatement (path) {
                if (path?.parentPath?.node?.type === 'Program') {
                    bodyStmts.push(path.node);
                }   
            },

            TSTypeAliasDeclaration (path) {
                if (path?.parentPath?.node?.type === 'Program') {
                    bodyStmts.push(path.node);
                }   
            },

            Identifier(path) {
                if (path.node.name == 'protobufPackage') {
                    path.parentPath.parentPath.remove();
                }
            },

            VariableDeclarator(path) {
                const name = path.node.id?.name;
                const value = path.node.init?.value;
                if (name === 'protobufPackage') {
                    currentPackage = value;
                    path.remove();
                }
            }

        });

        const recursiveNamespace = (names, moduleBlockBody) => {
            if (!names || !names.length) return moduleBlockBody;
            const name = names.pop();
            const body = [
                t.exportNamedDeclaration(
                    t.tsModuleDeclaration(
                        t.identifier(name),
                        t.tsModuleBlock(recursiveNamespace(names, moduleBlockBody))
                    )
                )
            ]
            return body;
        };

        if (currentPackage) {
            // lets package this up
            const body = []
            .concat(importStmts)
            .concat(bodyStmts)
            .concat(
                recursiveNamespace(currentPackage.split('.').reverse(), bodyStmts)
            );

            const customAst = t.file(t.program(body, [], "module"));
            const output = generate(customAst);
            const fileName = tsFile;
            const file = path.join(OUTPATH, '.', fileName.replace(PROTOPATH, ''))
            writeFileSync(file, output.code);
        } else {
            throw new Error('could not find a package');
        }

        // if (currentPackage) {
        //     // lets package this up
        //     const body = []
        //     .concat(importStmts)
        //     .concat(exportStmts)
        //     .concat(
        //         recursiveNamespace(currentPackage.split('.').reverse(), exportStmts)
        //     );

        //     const customAst = t.file(t.program(body, [], "module"));
        //     const output = generate(customAst);
        //     const fileName = tsFile;
        //     const file = path.join(OUTPATH, '.', fileName.replace(PROTOPATH, ''))
        //     console.log(file);

        //     writeFileSync(file, output.code);
        //     writeFileSync('testing3.ts', output.code);
        // } else {
        //     throw new Error('could not find a package');
        // }

    });

};

main();
