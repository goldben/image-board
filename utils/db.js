const spicedPg = require('spiced-pg');
const dburl = process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageboard"
var db = spicedPg(dburl);


////////////7////////store functions/////////////////////////////////
module.exports.insertImgInDb = function insertImgInDb(
    url,
    username,
    title,
    description
) {
    return db.query(
        `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) returning *;`,
        [url, username, title, description]
    );
};

////////////////////////////get functions////////////////////////////

module.exports.getImages = function() {
	return db.query(`SELECT * FROM images`);
};
