const express = require('express');
const app = express();

const config = require('./config');
const db = require('./config/database');

const userRouter = require('./api/routes/user');
const postRouter = require('./api/routes/post');

const cors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
};

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cors);

app.use('/user', userRouter);
app.use('/post', postRouter);

app.listen(config.port, console.log('Server connected to http://localhost:%s', config.port));















// ------------------------------------------------------------------

// const bodyParser = require('body-parser');
// const { reqparams, notEmpty } = require('@raggesilver/reqparams');
// const User = require('./api/models/user');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));

// // Data needed to create an user and their validation
// let registerParams = {
//     username: {
//         // validate: (val) => val != 'Paulomemama' // Return val if != to text.
//         validate: async (val) => {
//             if (!notEmpty(val)) {
//                 try {
//                     if (!await User.findOne({ username: val }))
//                         return (true);
//                 } catch(e) {
//                     console.log(e);
//                 }
//                 return ('Username already registered.');
//             }
//         }
//     },
//     password: {
//         validate: (val) => {
//             if(val.length < 8 || val.length > 16)
//                 return ('Password needs to have between 8 and 16 characters.');
//             // Add other validators
//             return (true);
//         }
//     },
//     email: {
//         validate: async (val) => {
//             if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
//                 .test(val))
//                 return ('Invalid e-mail');
//             try {
//                 if (!await User.findOne({ email: val }))
//                     return (true);
//             } catch(e) {
//                 console.log(e);
//             }
//             return ('E-mail already in use.');
//         }
//     }
// };

// app.post("/api/auth/register", reqparams(registerParams), (req, res) => {
//     console.log(req.body);
//     res.end('Ok');
// });

// app.get('/api', (req, res) => {
//     res.json({
//         message: 'Welcome to the API'
//     });
// });

// app.post('/api/posts', verifyToken, (req, res) => {
//     jwt.verify(req.token, password, (err, authData) => {
//         if (err) {
//             res.sendStatus(403);
//         } else {
//             res.json({
//                 message: 'Post created...',
//                 authData
//             });
//         }
//     });
// });

// app.post('/api/login', (req, res) => {
//     jwt.sign({username}, {password}, {expiresIn: '30s' }, (err, token) => {
//         res.json({
//             token
//         });
//     });
// });

// // Format of token
// // Authorization: Bearer <access_token>

// // Verify token
// function verifyToken(req, res, next) {
//     // Get auth header value
//     const bearerHeader = req.headers['authorization'];
//     // Check if bearer is undefined
//     if (typeof bearerHeader !== 'undefined') {
//         // Split at the space
//         const bearer = bearerHeader.split(' ');
//         // Get token from array
//         const bearerToken = bearer[1];
//         // Set the token
//         req.token = bearerToken;
//         // Next middleware
//         next();
//     } else {
//         // Forbidden
//         res.sendStatus(403);
//     }
// }

// const mongoOpts = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     reconnectInterval: 30000, // Try to reconnect after 30s
//     reconnectTries: 600, // Just be a little more persistent (try for 5 hours)
// };

// /**
// * Start the app after mongoose connected
// */
// mongoose.connect(process.env.DB_URL, mongoOpts)
//  .then(() => {
//     app.listen(3000, () => {
//         console.log('Server connected to port 3000.');
//     });
//  })
//  .catch(err => log(err));
