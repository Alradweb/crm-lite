
const bcrypt  = require ('bcryptjs');
const validator = require('email-validator');
const jwt = require('jsonwebtoken');
const {isDeniedRequest, errorHandler} = require('../utils/authHandler');
const keys = require('../config/keys');
const User = require('../models/User');

module.exports.login = async (req,res) => {
    if(isDeniedRequest(req)){
        res.status(403).json({
            message: "Authorization failed"
        });
        return
    }
    const candidate = await User.findOne({email: req.body.email});
    if(candidate){
        const password = bcrypt.compareSync(req.body.password,candidate.password);
        if(password){
            const token = jwt.sign({
                email: candidate.email,
                id: candidate._id
            }, keys.jwt, {expiresIn: '1h'});
            res.status(200).json({
                token: `Bearer ${token}`
            })
        }else {
            res.status(401).json({
                message: "Passwords do not match."
            })
        }
    }else {
        res.status(404).json({
            message: "User not found."
        })
    }
};


module.exports.registration = async (req,res) => {
    if(isDeniedRequest(req)){
        res.status(403).json({
            message: "Registration failed."
        });
        return
    }
    const candidate = await User.findOne({email: req.body.email});
    if(candidate){
        res.status(409).json({
            message: "Such email already exists. Try again."
        })
    }else if(!validator.validate(req.body.email)){
        res.status(403).json({
            message: "Incorrect email. Try again."
        })
    }else{
        const salt = bcrypt.genSaltSync(10);
        const password = req.body.password;
        const hash = bcrypt.hashSync(password, salt);
        const user = new User({
            email: req.body.email,
            password: hash
        });
        try{
            await user.save();
            res.status(201).json(user);
        }catch(e){
            errorHandler(res,e);
            console.log(e)
        }
    }

};