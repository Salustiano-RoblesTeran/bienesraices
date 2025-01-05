import multer from 'multer'
import path from 'path'
import { generarId } from '../helpers/tokens.js'


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads/'); // Directorio de almacenamiento
    },
    filename: function(req, file, cb) {
        cb(null, generarId() + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});

const upload = multer({ storage })


export default upload;