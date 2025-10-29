import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const token = res.cookies;

    if(!token){
        return res.json({success: false, message: "Unauthorized access"});
    }

    try{
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        if(tokenDecoded._id){
            req.body.userId = tokenDecoded._id;
        }
        else{
            return res.json({success: false, message: "Unauthorized access"});
        }
        next();
    }catch(error){
        res.json({success: false, message: error.message})
    }
}

export default userAuth;