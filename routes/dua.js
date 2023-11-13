const express = require('express');
const router = express.Router(); // Create an Express.js app

const database = require("../server/database");
const httpMsg = require("http-msgs"); // Include Express.js

router.use(express.urlencoded({ extended: true }));

router.get('/dua', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    database.loadDuas((results) => {
        res.render('dua', {data: results, selectedCategory: 2});
    });
});

router.post('/loadDua', (req, res) => {
    const category = req.body["dua-cat"];
    console.log(category);
    database.loadDuaByCategory(category, (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error' });
        } else {
          res.render('dua', {data: results, selectedCategory: category}); 
        }
      });

  });
module.exports = router

