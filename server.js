const express = require('express');
const app = express();
//const routes = require('routes');
const bodyParser = require('body-parser');
const { reqparams, notEmpty } = require('@raggesilver/reqparams');
const User = require('./api/models/user');
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let registerParams = {
    username: {
        // validate: (val) => val != 'Paulomemama' // Return val if != to text.
        validate: async (val) => {
            if (!notEmpty(val)) {
                try {
                    if (!await User.findOne({ username: val }))
                        return (true);
                } catch(e) {
                    console.log(e);
                }
                return ('Username already registered.');
            }
        }
    },
    password: {
        validate: (val) => {
            if(val.length < 8)
                return ('Password needs to have at least 8 characters.');
            // Add other validators
            return (true);
        }
    },
    email: {
        validate: async (val) => {
            if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                .test(val))
                return ('Invalid e-mail');
            try {
                if (!await User.findOne({ email: val }))
                    return (true);
            } catch(e) {
                console.log(e);
            }
            return ('E-mail already in use.');
        }
    }
};

app.post("/api/auth/register", reqparams(registerParams), (req, res) => {
    console.log(req.body);
    res.end('Ok');
});

const mongoOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    reconnectInterval: 30000, // Try to reconnect after 30s
    reconnectTries: 600, // Just be a little more persistent (try for 5 hours)
};

/**
* Start the app after mongoose connected
*/
mongoose.connect(process.env.DB_URL, mongoOpts)
 .then(() => {
    app.listen(3000, () => {
        console.log('Server connected to port 3000.');
    });
 })
 .catch(err => log(err));
