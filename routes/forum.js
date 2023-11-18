const express = require('express');
const router = express.Router(); // Create an Express.js app

const database = require("../server/database");
const httpMsg = require("http-msgs"); // Include Express.js


router.get('/forum', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    database.loadPosts((results) => {
        res.render('forum', {data: results});
    });
});


router.post('/new-post', (req, res) => {

    database.insertNewPosts(req.body["paiso"], (isSuccess) => {
        httpMsg.sendJSON(req, res, {
            success: isSuccess,
        });
    });
});

router.post('/new-comment/:id', (req, res) => {

    // console.log(req.body["post_id"])
    const postId = req.params.id;
    // console.log(postId);
    // if(req.body.commented!=''){
    database.insertNewComments(postId, req.body["commented"], (isSuccess) => {
        httpMsg.sendJSON(req, res, {
            success: isSuccess,
        });
    });
});


//export the router.
//It will be used in 'app.js'
module.exports = router