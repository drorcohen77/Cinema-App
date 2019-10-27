//Install express server
const express = require('express');
const path = require('path');
// const router = express.Router();

const app = express();

// Serve only the static files form the angularapp directory
// app.use(express.static(__dirname + '/dist/cinemapicker'));
app.use('/', express.static('cinemapicker', { redirect: false }));

// app.get('/main/movies', function(req, res) {

//     res.sendFile(path.join(__dirname + '/dist/cinemapicker/index.html'));
// });
app.get('*', function(req, res, next) {
    res.sendFile(path.resolve('cinemapicker/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);