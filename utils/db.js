const spicedPg = require("spiced-pg");
const dburl =
  process.env.DATABASE_URL ||
  "postgres:postgres:postgres@localhost:5432/imageboard";
var db = spicedPg(dburl);

////////////7////////store functions/////////////////////////////////
module.exports.insertImgInDb = function(url, username, title, description) {
  return db.query(
    `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) returning *;`,
    [url, username, title, description]
  );
};

module.exports.insertCommentIndb = function(comment, username, postId) {
  return db.query(
    `INSERT INTO comments (comment, username, postId) VALUES ($1, $2, $3) returning *;`,
    [comment, username, postId]
  );
};

////////////////////////////get functions////////////////////////////

module.exports.getImages = function() {
  return db.query(
    `SELECT *, (
     SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images ORDER BY id DESC LIMIT 6;`
  );
};

exports.getMoreImages = function(id) {
  return db.query(
    `SELECT *, (
       SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images
       WHERE id < $1
       ORDER BY id DESC
       LIMIT 3;`,
    [id]
  );
};
exports.getlastImage = function(id) {
  return db.query(
    `SELECT *, (
       SELECT id FROM images
       ORDER BY id ASC
       LIMIT 1)
       AS lowest_id FROM images
       WHERE id < $1
       ORDER BY id DESC
       LIMIT 1;`,
    [id]
  );
};

exports.lowestId = function(id) {
  return db.query(
    `SELECT id FROM images
        BY id ASC
        limit 1;
        `,
    [id]
  );
};

module.exports.getComments = function(postId) {
  return db.query(
    `SELECT * FROM comments WHERE postId = $1 ORDER BY id asc
	LIMIT 5;`,
    [postId]
  );
};
module.exports.getImgInfo = function(id) {
  return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

//////////////////DELETE///////////////////////////////////
module.exports.deleteImage = function deleteImage(id) {
  return db.query(
    `
        DELETE FROM images WHERE id = $1;
        `,
    [id]
  );
};
module.exports.deleteComments = function deleteComments(id) {
  return db.query(
    `
        DELETE FROM comments WHERE postId = $1;
        `,
    [id]
  );
};
