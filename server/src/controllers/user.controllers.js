import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";


export const register = async (req, res) => {
    const {username, useremail, password} = req.body;
    if(!username || !useremail || !password)
        return res.json({success: false, message: "Missing Details"})
    try{
        //check if user already exists
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            res.json({success: false, message: "User already exists"});
        }

        //hash pasword using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        //add user into database
        const user = userModel({username, useremail, password: hashedPassword});
        await user.save();

        //generate token using jwt
        
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}