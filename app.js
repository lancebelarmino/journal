const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const ejs = require('ejs');
const _ = require('lodash');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));



/*** Mongoose ***/
const mongodb_pass = process.env.MONGODB_PASS;

mongoose.connect(`mongodb+srv://admin-lance:${mongodb_pass}@cluster0.iyljx.mongodb.net/blog?retryWrites=true&w=majority`, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postsSchema = new mongoose.Schema ({
    title: { type: String },
    body: { type: String }
});

const Post = mongoose.model('Post', postsSchema);

// Test
// Post.create( { title: 'Test', body: 'This is a test.'}, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log('Successfully saved all the items to database.');
//     }
// });


          
/*** Home Page ***/
app.get('/', (req, res) => {

    Post.find((err, posts) => {
        if (!err) {
            res.render('home', {
                title: 'Daily Journal',
                logPosts: posts.reverse(),
            });
        } else {
            console.log(err);
        }
    });

});



/*** About Page ***/
app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About',
	});
});



/*** Contact Page ***/
app.get('/contact', (req, res) => {
	res.render('contact', {
		title: 'Contact Us',
	});
});



/*** Compose Page ***/
app.get('/compose', (req, res) => {
    const success = "";

	res.render('compose', {
		title: 'Compose',
        successMessage: success
	});
});

app.post('/compose', (req, res) => {
    const postTitle = req.body.postTitle;
    const postBody = req.body.postBody;
    const newPost = new Post({ title: postTitle, body: postBody });
    const success = "Post published! Congrats.";

    newPost.save();
    res.render('compose', {
        title: 'Compose',
        successMessage: success
    });
});



/*** Post Page ***/
app.get('/post/:postId', (req, res) => {
    const postId = req.params.postId;

    Post.findOne( { _id: postId }, (err, postPage) => {
        if (!err) {
            res.render('post', {
                title: postPage.title,
                indvPostTitle: postPage.title,
                indvPostBody: postPage.body
            });
        } else {
            console.log(err)
        }
    });
});



/*** Port ***/
app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});