const {expect} = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

describe("Auth Controller", function(){
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

    /* before and after runs once and in single describe and beforeEach and afterEach 
    runs before and after it // they usually use for resetting sth before or after per it */
    beforeEach(function(){})
    afterEach(function(){})

    it("should throw an error with code 500 if accessing the database failed!",function(done){
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.postLogin(req, {}, () => {}).then(result => {
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);
        done();
        });

        User.findOne.restore();
        
        })
        
    it("should send a valid user status for get user status function", function(done){
            const req = {
                userId: "5fc9a5607881b2332bdd0603"
            }
            const res = {
                statusCode: 500,
                userStatus: null,
                status: function(status){
                    this.statusCode = status;
                    return this;
                },
                json: function(data){
                    this.userStatus = data.status;
                }
            };
            AuthController.getUserStatus(req,res,() => {}).then(result => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal("I am new!");
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