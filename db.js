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
	mongoose.connection.on('connected', function() {
	    // Hack the database back to the right one, because when using mongodb+srv as protocol.
	    if (mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
		mongoose.connection.db = mongoose.connection.client.db(db);
	    }
	    console.log('Connection to Mongo established.')
	});
	mongoose.connect(`mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`);
} else {
	console.log("connecting to local database");
	mongoose.connect('mongodb://'+mongoConfig.host+':'+mongoConfig.port+'/'+mongoConfig.db, { useNewUrlParser: true });
}


