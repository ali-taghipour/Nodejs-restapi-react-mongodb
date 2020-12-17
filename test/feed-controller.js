const {expect} = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const express = require("express");
const io = require("../socket");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

describe("Feed Controller", function(){
    before(function(done){
        mongoose.connect("mongodb://localhost:27017/test-messages",{ useNewUrlParser: true,useUnifiedTopology: true })
        .then(res => {
            const user = new User({
                email:"test@test.com",
                password: "tester",
                name: "test man",
                posts:[],
                _id:"5fc9a5607881b2332bdd0603"
            })
            return user.save();
        }).then(res => {
            done();
        })
    })

    it("should add new post to creator of that post",function(done){
        const app = express();
        const server = app.listen(8080);
        const socketIo = io.init(server);
        socketIo.on("connection",socket => {
            io.getIO().emit("posts",{
                action: "",
                post: {}
            })
        })
        const req = {
            body: {
                title: "test post",
                content: "content of test post"
            },
            file:{
                path: "abc"
            },
            userId: "5fc9a5607881b2332bdd0603"
        };
        const res = {
            status: function(){
                return this;
            },
            json: function(){}
        }
        FeedController.createPost(req,res,() => {}).then(savedUser => {
            expect(savedUser).to.have.property("posts");
            expect(savedUser.posts).to.have.length(1);
            io.getIO().close();
            done();
        })
        })

    after(function(done){
        User.deleteMany({}).then(res => {
            mongoose.disconnect();
        }).then(res => {
            done();
        })
    })
})