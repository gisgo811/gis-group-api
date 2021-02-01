/**
 * Created by SZ on 2018/05/23.
 */
const express = require('express');
const User = require("../models/user");
const router = express.Router(); 
/* GET users listing. */
router.get('/',  (req, res) => {
    User.find({super: {$ne:1}}).lean()
        .select('name code date develop language city college status')
        .exec(  (err, docs) => {
            if (err) {
                res.status(404);
                res.json(err);
            } else {
                res.status(200);
                res.json(docs);
            }
        });
});

/* find user by id. */
router.get('/detail/:id',  (req, res) => {
    User.findOne({_id: req.params.id}).lean()
        .select('-password')
        .exec( (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json(doc);
            }
        });
});

/* create user. */
router.post('/create',  (req, res) => {
    User.findOne({github: req.body.user.github}, async (err, user) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            if (user) {
                res.status(200);
                res.json({
                    result: false,
                    code: 101,
                    msg: 'Github账户已存在！'
                });
            } else {
                const user = new User(req.body.user);
                user.register();
                const array = await User.find().lean().limit(1).sort({ 'code': -1 });
                let code = array.length > 0 ? parseInt(array[0].code) : 0;
                user.code = (code + 1).toString().padStart(4, "0");
                user.save( (err, doc) => {
                    if (err) {
                        res.status(500);
                        res.json(err);
                    } else {
                        res.status(200);
                        res.json({
                            result: true,
                            user : doc
                        });
                    }
                });
            }
        }
    });
});

/* update user by id. */
router.post('/:id/update',  (req, res) => {
    User.findOneAndUpdate({_id: req.params.id}, req.body.user, {new: true},   (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result:true});
        }
    });
});

/* update user pwd by id. */
router.post('/:id/password',  (req, res) => {
    req.body.user.password = User.encrypt(req.body.user.password);
    User.findOneAndUpdate({_id: req.params.id}, req.body.user, {new: true},  (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result: true});
        }
    });
});

/**
 * update authority  by id.
 */
router.post('/:id/authority',  (req, res) => {
    const user = new User(req.body.user);
    user.auth();
    User.findOneAndUpdate({_id: req.params.id}, user, {new: true},  (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result: true});
        }
    });
});

/* remove user by id. */
router.get('/:id/remove',  (req, res) => {
    User.findOneAndRemove({_id: req.params.id},  (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result: true});
        }
    });
});


module.exports = router;

