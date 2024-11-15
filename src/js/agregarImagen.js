import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus Imágenes aquí.',
    acceptedFiles: 'image/png,image/jpg,image/jpeg',  // Esto permite imágenes PNG, JPG y JPEG
    maxFilesize: 5, // Tamaño máximo en MB
    maxFiles: 1, // Número máximo de archivos permitidos
    parallelUploads: 1, // Número de subidas paralelas
    autoProcessQueue: false, // Subir automaticamente la imagen
    addRemoveLinks: true, // Mostrar enlace para borrar archivo
    dictRemoveFile: 'Borrar Archivo', // Texto para el enlace de borrar archivo
    dictMaxFilesExceeded: 'la cantidad es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function () {
        const dropzone = this;
        const btnPublicar = document.querySelector('#publicar')

        btnPublicar.addEventListener('click', function () {
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function () {  
            if (dropzone.getActiveFiles().length === 0) {
                window.location.href = '/mis-propiedades';
            }
        });
    }
};
