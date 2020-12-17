const {expect} = require("chai");

const authMiddleware = require("../middleware/is_auth");
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

describe("auth middleware", function(){
    it("it should throw an error if no authorization header is present", function(){
        const req = {
            get: function(headerName){
                return null;
            }
        };
        expect(authMiddleware.bind(this,req,{},() => {})).to.throw("Not Authenticated!")
    });
    
    it("it should throw an error if no authorization header is only one string", function(){
        const req = {
            get: function(headerName){
                return "xzy";
            }
        };
        expect(authMiddleware.bind(this,req,{},() => {})).to.throw()
    });

    it("should yield a userId after decoding the token", function(){
        const req = {
            get: function(headerName){
                return "Bearer wefwefedfergtyt";
            }
        };
        /** sinon register the method to restore it because if it wasn't we should define jwt.verify 
         * globally and it influence the rest test that depends on it */
        sinon.stub(jwt, "verify");
        jwt.verify.returns({
            userId: "abc"
        })
        authMiddleware(req,{},() => {});
        expect(req).to.have.property("userId");
        expect(req).to.have.property("userId","abc");
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it("it should throw an error if token has not verified!", function(){
        const req = {
            get: function(headerName){
                return "Bearer xzy";
            }
        };
        expect(authMiddleware.bind(this,req,{},() => {})).to.throw()
    });

})
