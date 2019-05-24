const db = require('./utils/db')
const express = require('express');
const app = express();
const s3 = require('./s3');
const amazonUrl = require(`./config`).s3Url;

app.use(express.static('./public'));

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

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
	console.log(req.body);
	// If nothing went wrong the file is already in the uploads directory
    // req.file will refer to the image that was just uploaded
    console.log('req.file: ', req.file);
    // So what we want to store in the images table is the amazonaws URL + the filename.
	const url = `${amazonUrl}${req.file.filename}`;
	console.log(url);
    const username = req.body.username;
    const title = req.body.title;
    const description = req.body.description;

    if (req.file) {
        db.insertImgInDb(url, username, title, description).then((data) => {
			console.log(data);
            res.json(data.rows[0]);
        })
		.catch(e => {
                console.log(e);
		});
    } else {
        res.json({
            success: false
        });
    }
});




app.get('/images', (req,res) =>{
	db.getImages().then(results =>{
		res.json(results.rows);
		//console.log('GET /images hit!!!', results.rows[0].url);
		//once front recieves JSON
	});

});

//////////////////////////////////////////////////////////////////////////////



app.listen(8080, () => console.log('I VUE JS'));
