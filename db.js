var mongoose = require('mongoose');

let mongoConfig =  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db:   process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
}


mongoose.connect('mongodb://'+mongoConfig.host+':'+mongoConfig.port+'/'+mongoConfig.db, { useNewUrlParser: true });


