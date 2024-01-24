// Create web server

// Import express
var express = require('express');
var app = express();

// Import body-parser
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Import mongoose
var mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/CommentDB');

// Create schema
var commentSchema = new mongoose.Schema({
    name: String,
    comment: String
});

// Create model
var Comment = mongoose.model('Comment', commentSchema);

// Set view engine
app.set("view engine", "ejs");

// Set static folder
app.use(express.static('public'));

// Set port
app.listen(3000);

// Set route
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/get-data', function (req, res) {
    Comment.find({}, function (err, data) {
        if (err) throw err;
        res.render('show-data', { comments: data });
    });
});

app.post('/insert', urlencodedParser, function (req, res) {
    var newComment = Comment(req.body).save(function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.post('/update', urlencodedParser, function (req, res) {
    Comment.findOneAndUpdate({ name: req.body.name }, { comment: req.body.comment }, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});

app.post('/delete', urlencodedParser, function (req, res) {
    Comment.findOneAndRemove({ name: req.body.name }, function (err, data) {
        if (err) throw err;
        res.json(data);
    });
});