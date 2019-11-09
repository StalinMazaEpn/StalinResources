//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//Leer los archivos de imagenes del directorio y retornar listado en MD
const stringHasSpaces = /\s/;
const arrDirectories = [{
        pathFolder: path.join("./", 'img'),
        filename: 'img_list.md'
    },
    {
        pathFolder: path.join("./", 'svg'),
        filename: 'svg_list.md'
    },
    {
        pathFolder: path.join("./", 'markers'),
        filename: 'markers_list.md'
    }
];

const readDirectoryMD = async (directory_path) => {
    return new Promise((resolve, reject) => {
        let listFiles = '';
        //passsing directoryPath and callback function
        fs.readdir(directory_path, function (err, files) {
            //handling error
            if (err) {
                console.error(`No se pudo leer el directorio ${directory_path}`);
                reject(err);
            }
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                const full_path = `${directory_path}/${file}`;
                const url = `https://raw.githubusercontent.com/StalinMazaEpn/StalinResources/master/${full_path}?sanitize=true`;
                // console.log(full_path);
                // console.log(url);
                // throw err('hola')
                const mdImage = ` **Archivo: ${file}** \n ![image_${file}](${full_path}) \n\n`;
                listFiles += mdImage;
                // if (stringHasSpaces.test(mdImage)) {
                //     console.log(mdImage); 
                // }
            });
            resolve(listFiles);
        });
    });
}

const renameFilesCleanSpaces = (directory_path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(directory_path, function (err, files) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(true)
            if (files.length > 0) {
                files.forEach(file => {
                    if (stringHasSpaces.test(file)) {
                        const old_name = file;
                        const new_name = file.replace(/ /g, "");
                        const old_path = path.join(directory_path, old_name);
                        const new_path = path.join(directory_path, new_name);
                        fs.rename(old_path, new_path, function (err) {
                            if (err) {
                                reject(err);
                            };
                        });
                    }
                });
            }

        });
    });
};

const renameFilesDir = () => {
    arrDirectories.forEach(async directory_item => {
        renameFilesCleanSpaces(directory_item.pathFolder);
    });
};

const writeFilesMD = () => {
    arrDirectories.forEach(async directory_item => {
        const filesMD = await readDirectoryMD(directory_item.pathFolder);
        writeInFile(filesMD, directory_item.filename);
    });
};

// Escribir listado archivos imagenes en un archivo MD
const writeInFile = (text, path) => {
    // specify the path to the file, and create a buffer with characters we want to write
    let buffer = new Buffer.from(text);
    return new Promise((resolve, reject) => {
        // Abrir el archivo en modo de escritura y añadir callback para escribir en el archivo
        fs.open(path, 'w', function (err, fd) {
            if (err) {
                console.error(`No se pudo abrir el archivo: ${path}`)
                reject(err);
            }
            // Escribir el contenido del buffer en el archivo
            fs.write(fd, buffer, 0, buffer.length, null, function (err) {
                if (err) {
                    console.error(`error writing file ${path}`);
                    reject(err);
                }
                fs.close(fd, function () {
                    console.log(`File ${path} was written succesfully`);
                    resolve(true);
                });
            });
        });
    });
}


const main = async () => {
    try {
        // renameFilesDir();
        // writeFilesMD();
    } catch (err) {
        console.error('Error', err);
    }
}
main();