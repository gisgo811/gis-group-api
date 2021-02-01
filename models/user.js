/**
 * Created by SZ on 2018/05/23.
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const crypto_key = "greengis";

//用户表（U表）
const UserSchema = new Schema({
    //用户名
    name: String,
    code: String,
    date: Date,
    //密码
    password: String,
    //用户状态:  0 = off 1 = on 2 = lock
    status: Number,
    //头像
    head: String,
    //1 = super admin, 0 = common user
    super: Number,
    //用户介绍
    description: String,
    //github
    github: String,
    //工程师
    develop: Number,
    //语言
    language: Number,
    //城市
    city: String,
    //学校
    college: String,
    //专业
    major: String,
    //用户token
    token: String,
    //token授权
    authority: {
        create_date: Date,  //授权日期
        valid_date: Date,    //有效期
        key: String           //密钥
    }
},{ collection: 'users' });

/**
 * Methods
 */
UserSchema.methods = {
    register : function(){
        this.password = this.encrypt();
        this.token = this.jwt();
    },
    encrypt: function () {
        try {
            return crypto
                .createHash('sha1')
                .update(this.password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    },
    jwt: function () {
        var obj = {
            id : this._id,
            exp:  moment().add(2, 'd').unix()
        };
        return jwt.sign(obj, crypto_key);
    },
    auth: function() {
        const obj = {
            id : this._id,
            exp:  moment(this.authority.valid_date).unix()
        };
        this.authority.key = jwt.sign(obj, crypto_key);
        this.authority.create_date = new Date();
    }
};

/**
 * Statics
 */
UserSchema.statics = {
    verify : function(token,callback){
        jwt.verify(token,crypto_key,callback);
    },
    encrypt: function (password) {
        try {
            return crypto
                .createHash('sha1')
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};


const User = mongoose.model('User', UserSchema);
module.exports = User;