const spicedPg = require('spiced-pg');
const dburl = process.env.DATABASE_URL || "postgres:postgres:postgres@localhost:5432/imageboard"
var db = spicedPg(dburl);


////////////7////////store functions/////////////////////////////////

////////////////////////////get functions////////////////////////////

module.exports.getImages = function() {
	return db.query(`SELECT * FROM images`);
};
