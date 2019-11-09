
//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//Leer los archivos de imagenes del directorio y retornar listado en MD
const readDirectoryMD = async (directory_path) => {
    const stringHasSpaces = /\s/;
    return new Promise((resolve, reject) => {
        let listFiles = '';
        //passsing directoryPath and callback function
        fs.readdir(directory_path, function (err, files) {
            //handling error
            if (err) {
                // return console.log('Unable to scan directory: ' + err);
                reject('Unable to scan directory: ' + err);
            } 
            //listing all files using forEach
            files.forEach(function (file) {
                // Do whatever you want to do with the file
                const mdImage = `![image_${file}](${directory_path}/${file}) \n`;
                listFiles += mdImage;
                // console.log(mdImage); 
                // if (stringHasSpaces.test(mdImage)) {
                //     console.log(mdImage); 
                // }
            });
            resolve(listFiles);
        });
    });
}
// Escribir listado archivos imagenes en un archivo MD
const writeInFile = (text, path) => {
    // specify the path to the file, and create a buffer with characters we want to write
    let buffer = new Buffer.from(text);
    return new Promise((resolve, reject) => {
        // Abrir el archivo en modo de escritura y añadir callback para escribir en el archivo
        fs.open(path, 'w', function (err, fd) {
            if (err) {
                console.log(`No se pudo abrir el archivo: ${path}`)
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
    const arrDirectories = [
        { name: 'img', 'file': 'img_list.md' },
        { name: 'svg', 'file': 'svg_list.md' },
        { name: 'markers', 'file': 'markers_list.md' }
    ];
    try {
        arrDirectories.forEach(async directory_item => {
            // const pathToRead = path.join(__dirname, directory_item.name);
            const pathToRead = path.join("./", directory_item.name);
            const filesMD = await readDirectoryMD(pathToRead);
            writeInFile(filesMD, directory_item.file);
        });
        // console.log('filesMD', filesMD);
    } catch (err) {
        console.log('Error', err);
    }
}
main();