const express = require('express');
const app = express();
//const routes = require('routes');
const bodyParser = require('body-parser');
const { reqparams, notEmpty } = require('@raggesilver/reqparams');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let registerParams = {
    username: {
        // validate: (val) => val != 'Paulomemama' // Return val if != to text.
        validate: notEmpty
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
        validate: (val) => {
            if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                .test(val))
                return (false);
            return (true);
        },
        msg: 'Invalid e-mail.'
    }
};

app.post("/api/auth/register", reqparams(registerParams), (req, res) => {
    console.log(req.body);
    res.end('Ok');
});

app.listen(3000, () => {
    console.log('Server connected to port 3000.');
});
