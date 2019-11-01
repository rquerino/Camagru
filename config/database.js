const mongoose = require('mongoose');
const config = require('./index');

const mongoOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        reconnectInterval: 30000, // Try to reconnect after 30s
        reconnectTries: 600, // Just be a little more persistent (try for 5 hours)
    };
    
const db = mongoose.connect(config.db_url, mongoOpts)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log('An error has occureed trying to connect to the database', err));

// const db = mongoose.connect(config.mongo_uri, { useNewUrlParser: true })
//     .then(() => console.log('Connected to database'))
//     .catch((err) => console.log('An error has occureed trying to connect to the database', err));

module.exports = db;