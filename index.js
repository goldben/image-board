const express = require(`express`);
const app = express();
const multer = require(`multer`);
const uidSafe = require(`uid-safe`);
const path = require(`path`);
const db = require(`./utils/db`);
const bodyParser = require(`body-parser`);

// const s3 = require("./s3");
// const amazonUrl = require(`./config`).s3Url;

app.use(express.static("./public"));

var diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

app.use(bodyParser.json());

////////////////////////////////////////// POST ////////////////////////////////////
app.post("/upload-from-url", function(req, res) {
  console.log("upload from url", req.body);
  let url = req.body.url;
  console.log(url);
  let username = req.body.username;
  let title = req.body.title;
  let description = req.body.description;

  if (url) {
    db.insertImgInDb(url, username, title, description)
      .then(results => {
        console.log(results);
        res.json(results.rows[0]);
      })
      .catch(e => {
        console.log("ERROR AT UPLOAD URL", e);
      });
  } else {
    res.json({
      success: false
    });
  }
});

// app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
//   console.log(req.body);
//   // If nothing went wrong the file is already in the uploads directory
//   // req.file will refer to the image that was just uploaded
//   console.log("req.file: ", req.file);
//   // So what we want to store in the images table is the amazonaws URL + the filename.
//   let url = `${amazonUrl}${req.file.filename}`;
//   console.log(url);
//   let username = req.body.username;
//   let title = req.body.title;
//   let description = req.body.description;
//
//   if (req.file) {
//     db.insertImgInDb(url, username, title, description)
//       .then(results => {
//         console.log(results);
//         res.json(results.rows[0]);
//       })
//       .catch(e => {
//         console.log("ERROR AT UPLOAD FILE", e);
//       });
//   } else {
//     res.json({
//       success: false
//     });
//   }
// });

app.post(`/addcomment`, (req, res) => {
  console.log("COMMENT REQUEST: ", req.body);
  //req.body.username req.body.comment req.body.imageId
  let username = req.body.username;
  let comment = req.body.comment;
  let imageId = req.body.imageId;

  console.log("new comment:", comment);
  db.insertCommentIndb(comment, username, imageId)
    .then(results => {
      console.log("results", results);

      let id = result.rows[0].id;
      let created_at = result.rows[0].created_at;

      res.json({
        id: id,
        username: username,
        comment: comment,
        imageId: imageId,
        created_at: created_at
      });
    })
    .catch(e => {
      console.log("ERROR AT ADD COMMENT", e);
    });
});

app.post("/delete/:id", (req, res) => {
  console.log("/delete request params", req.params.id);
  db.deleteComments(req.params.id)
    .then(() => {
      console.log(`image ${req.params.id} comments are deleted`);
      db.deleteImage(req.params.id).then(() => {
        console.log(`image ${req.params.id} is deleted`);
      });
    })
    .catch(err => {
      console.log("error in delete", err);
    });
});

////////////////////////////////////// GET /////////////////////////////////////////////

app.get("/images", (req, res) => {
  db.getImages()
    .then(results => {
      res.json(results.rows);
      console.log("GET /images: ", results.rows);
    })
    .catch(e => {
      console.log("ERROR AT GET IMAGES", e);
    });
});

app.get("/get-more-images/:id", (req, res) => {
  let lastId = req.params.id;
  db.getMoreImages(lastId)
    .then(results => {
      res.json(results.rows);
      //console.log('GET /images hit!!!', results.rows[0].url);
      //once front recieves JSON
    })
    .catch(e => {
      console.log("ERROR AT GET IMAGES", e);
    });
});

app.get(`/popup-data/:id`, (req, res) => {
  let id = req.params.id;
  let imgInfo;
  //console.log('req comments for post id', id);

  db.getImgInfo(id)
    .then(results => {
      imgInfo = results.rows[0];
      //console.log('img info:', imgInfo);
    })
    .then(() => {
      db.getComments(id)
        .then(results => {
          //console.log('getcomments', results);
          let comments = results.rows;
          //console.log('imginfo:', imgInfo);
          //console.log('comment:', comments);

          res.json({
            imageInfo: imgInfo,
            comments: comments
          });
        })
        .catch(e => {
          console.log("ERROR AT GET POP UP DATA1", e);
        });
    })
    .catch(e => {
      console.log("ERROR AT GET POP UP DATA2", e);
      res.json({
        imageInfo: undefined,
        comments: undefined
      });
    });
});

//////////////////////////////////////////////////////////////////////////////

if (require.main == module) {
  //HEROKU:
  app.listen(process.env.PORT || 8080, () => console.log("Im listening"));
}
