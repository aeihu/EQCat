var  multer=require('multer');

var upload = function(path){
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            //cb(null, './public/icons')
            cb(null, path)
        }, 
          
        filename: function (req, file, cb) {
            var fileFormat = (file.originalname).split(".");
            cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    });  

    return multer({
        storage: storage
    });
} 

module.exports = upload;