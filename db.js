var mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
	console.log(`loading settings from .env file...`);
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
const connectOpts = { useNewUrlParser: true, useUnifiedTopology: true };
const uri = (process.env.NODE_ENV !== "production")
	? 'mongodb://'+mongoConfig.host+':'+mongoConfig.port+'/'+mongoConfig.db
	: `mongodb+srv://${mongoConfig.user}:${mongoConfig.pass}@${mongoConfig.host}/${mongoConfig.db}?retryWrites=true&w=majority`

mongoose.connect(uri, connectOpts, 
	(err) => {
		if (err) console.error("ERROR. Unable to connect to mongodb ("+uri+")", err);
		console.log(`Mongoose ${!mongoose.connection.readyState ? 'NOT' : 'successfully'} connected`);
	});