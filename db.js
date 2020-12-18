var mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
	console.log("loading settings from .env file...");
	require('dotenv').load();
} else {
	console.log("using settings from ENV variables...");
}
let mongoConfig =  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db:   process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
}

if (mongoConfig.user != null && mongoConfig.user != '') {
	mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`);
} else {
	console.log("connecting to local database");
	mongoose.connect('mongodb://'+mongoConfig.host+':'+mongoConfig.port+'/'+mongoConfig.db, { useNewUrlParser: true });
}


