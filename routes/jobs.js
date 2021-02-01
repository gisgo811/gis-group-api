/**
 * Created by DWUSER on 2016/4/1.
 */
const express = require('express');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const router = express.Router();
const Job = require("../models/job");


/**
 * 所有任务
 */
router.get('/', (req, res) => {
    Job.find()
        .populate([{path:'creator',select: 'name'}])
        .select('name code top status category start_date creator children')
        .exec( (err,docs) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json(docs);
            }
        });
});

/**
 * 任务详情
 */
router.get('/detail/:id', (req, res) => {
    Job.findOne({_id: req.params.id})
        .populate([{path:'workflow.user',select:'name'}, {path: 'comments.user', select:'name'}])
        .populate([{path:'creator',select:'name'},{path: 'editors',select:'name'},{path: 'followers', select:'name'}])
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


/**
 * 创建任务
 */
router.post('/create', (req, res) => {
    req.body.job.code = moment().format("x");
    Job.create(req.body.job, (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        }
        else{
            res.status(200);
            res.json({
                result : true,
                job : doc
            });
        }
    });
});

/**
 * 删除任务
 */
router.get('/:id/remove', (req, res) => {
    Job.findOneAndRemove({_id: req.params.id}, (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result:true});
        }
    });
});

/**
 * 更新任务
 */
router.post('/:id/update',  (req, res) => {
    Job.findOneAndUpdate({_id: req.params.id}, req.body.job, {new: true},  (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result:true});
        }
    });
});

/**
 * 添加参与者
 */
router.post('/:id/editor/create',  (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { editors: req.body.user } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    );
});
/**
 * 删除参与者
 */
router.get('/:id/editor/:sid/remove', (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { editors: req.params.sid } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    )
});

/**
 * 添加关注者
 */
router.post('/:id/follower/create',  (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { followers: req.body.user } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    );
});
/**
 * 删除关注者
 */
router.get('/:id/follower/:sid/remove', (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { followers: req.params.sid } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    )
});

/**
 * 添加子任务
 */
router.post('/:id/sub/create',  (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { children: req.body.child } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    );
});
/**
 * 删除子任务
 */
router.get('/:id/sub/:sid/remove', (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { children: { _id: req.params.sid} } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    )
});

/**
 * 更新子任务
 */
router.post('/:id/sub/:sid/update',  (req, res) => {
    Job.findOneAndUpdate({_id: req.params.id, "children._id": req.params.sid}, { "children.$": req.body.child }, {new: true},  (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result:true});
        }
    });
});

/**
 * 添加评论
 */
router.post('/:id/comment/create',  (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { comments: req.body.comment } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    );
});
/**
 * 删除评论
 */
router.get('/:id/comment/:cid/remove', (req, res) => {
    Job.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { comments: { _id: req.params.cid} } },
        { new: true },
        (err, doc) => {
            if (err) {
                res.status(500);
                res.json(err);
            } else {
                res.status(200);
                res.json({result:true});
            }
        }
    )
});

/**
 * 更新评论
 */
router.post('/:id/comment/:cid/update',  (req, res) => {
    Job.findOneAndUpdate({_id: req.params.id, "comments._id": req.params.cid}, { "comments.$": req.body.comment }, {new: true},  (err, doc) => {
        if (err) {
            res.status(500);
            res.json(err);
        } else {
            res.status(200);
            res.json({result:true});
        }
    });
});

module.exports = router;