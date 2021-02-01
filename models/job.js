
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const User = require('./user');

//项目任务
const JobSchema = new Schema({
    //名称
    name: String,
    code: String,
    //描述
    description: String,
    //OPEN, CLOSE
    status: Number,
    //分类
    category: Number,
    //开始日期
    start_date: Date,
    //完成日期
    finish_date: Date,
    //是否置顶
    top: Boolean,
    //是否归档
    close: Boolean,
    //创建人
    creator: {
        type: ObjectId,
        ref: User
    },
    //任务参与人
    editors: [{
        type: ObjectId,
        ref: User
    }],
    //任务关注人
    followers: [{
        type: ObjectId,
        ref: User
    }],
    //子任务
    children: [
        {
            name: String,
            done: Boolean
        }
    ],
    workflow: [
        {
            //提交时间
            date: Date,
            //提交意见
            content: String,
            //提交人
            user: {
                type: ObjectId,
                ref: User
            }
        }
    ],
    comments: [
        {
            content: String,
            date: Date,
            user: {
                type: ObjectId,
                ref: User
            }
        }
    ]
},{ collection: 'jobs' });
const Job = mongoose.model('Job', JobSchema);
module.exports = Job;