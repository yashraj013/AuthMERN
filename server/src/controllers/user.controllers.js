import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";

export const register = async (req, res) => {
    const {username, useremail, password} = req.body;
    if(!username || !useremail || !password)
        return res.json({success: false, message: "Missing Details"})
    try{
        //check if user already exists
        const existingUser = await userModel.findOne({useremail})
        if(existingUser){
            res.json({success: false, message: "User already exists"});
        }

        //hash pasword using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        //add user into database
        const user = userModel({username, useremail, password: hashedPassword});
        await user.save();

        //generate token using jwt
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn:'7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.json({success: true});
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const{ useremail, password } = req.body;

    if(!useremail || !password){
        return res.status(400).json({success: false, message: "email and password is required"})
    }
    try{
        const user = await userModel.findOne({useremail});
        if(!user){
            return res.json({success: false, message: "Incorrect email"})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, meggase: "enter correct password"})
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn:'7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.json({success: true});
    }
    catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict'
        })
        return res.json({success: true, message: "logged out"})
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}