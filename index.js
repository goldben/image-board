const express = require('express');
const app = express();
const db = require('./utils/db');
const bodyparser = require('body-parser');
//////////////////////////////////////////////////////////////////////////////
var multer = require('multer');
var uidSafe = require('uid-safe');
var path = require('path');

var diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
      uidSafe(24).then(function(uid) {
          callback(null, uid + path.extname(file.originalname));
      });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

//////////////////////////////////////////////////////////////////////////////

app.post('/upload', uploader.single('file'), function(req, res) {
    // If nothing went wrong the file is already in the uploads directory
    if (req.file) {
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

//////////////////////////////////////////////////////////////////////////////

app.use(express.static('./public'));



app.get('/images', (req,res) =>{
	db.getImages().then(results =>{
		res.json(results.rows);
		console.log('GET /images hit!!!', results.rows[0].url);
		//once front recieves JSON
	});

});

//////////////////////////////////////////////////////////////////////////////



app.listen(8080, () => console.log('I VUE JS'));
