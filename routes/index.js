const express = require("express");
const router = express.Router();
const config = require("../config");
const axios = require("axios");
const User = require("../models/user");

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

router.get('/auth', (req, res) => {
    res.send({url:"https://github.com/login/oauth/authorize?client_id=" + config.client});
});

router.post('/github', (req, res) => {
    axios({
        url:"https://github.com/login/oauth/access_token?client_id=" + config.client + "&client_secret=" + config.secret + "&code=" + req.body.code,
        method: "POST",
        headers:{"Accept":"application/json"}
    })
    .then( (result) =>{
        axios({
            url:"https://api.github.com/user",
            method:"GET",
            headers:{"Authorization":"token" + " " + result.data.access_token}
        })
        .then( async (result) => {
            result.data.user = await User.findOne({github: result.data.login});
            res.send(result.data);
         })
        .catch( (err) => {
            res.send(err);
        })
    })
    .catch( (err) =>{
        res.send(err);
    })
});

module.exports = router;
