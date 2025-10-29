import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
    const {username, useremail, password} = req.body;
    if(!username || !useremail || !password)
        return res.json({success: false, message: "Missing Details"})
    try{
        //check if user already exists
        const existingUser = await userModel.findOne({useremail})
        if(existingUser){
            return res.json({success: false, message: "User already exists"});
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

        //Send welcome email to user
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: useremail,
            subject: "welcome to mernAuth",
            text: `Welcome to mernAuth. Your account is created with id: ${useremail}`
        }
        await transporter.sendMail(mailOption);
        
        return res.json({success: true, userId: user._id});
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
            return res.json({success: false, message: "enter correct password"})
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{ expiresIn:'7d'});
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.json({success: true, message: "logged in successfully"});
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

export const sendVerifyOpt = async (req, res) => {
    try{
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success: false, message: "Account is already verified"});
        }

        //generate otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyotp = otp;
        user.verifyotpExpiredAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        //send otp to user email
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.useremail,
            subject: "Account Verification OTP",
            text: `Your account verification otp is ${otp}. It is valid for 24 hours.`
        }
        await transporter.sendMail(mailOption);
        res.json({success: true, message: "OTP sent to your email"})

    } catch(error){
        res.json({success: false, message: error.message})
    }

}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if(!userId || !otp){
        return res.json({success: false, message: "Missing details"})
    }
    try{
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success: false, message: "User not found"})
        }
        //check if otp is invalid
        if(user.verifyotp === '' || user.verifyotp !== otp){
            return res.json({success: false, message: "Invalid OTP"})
        }
        //check if otp is expired
        if(user.verifyotpExpiredAt < Date.now()){
            return res.json({success: false, message: "OTP expired"})
        }

        user.isAccountVerified = true;
        user.verifyotp = '';
        user.verifyotpExpiredAt = null;
        await user.save();
        
        res.json({success: true, message: "Account verified successfully"})


    }catch(error){
        res.json({success: false, message: error.message})
    }
}