import jwt from "jsonwebtoken";
import {User} from "../models/User.js"

const protect = async(req,res,next) =>{
    try {
       let token = req.headers.authorization;
       
       if(token && token.startsWith("Bearer")){
        token = token.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
       }
    } catch (error) {
        res.status(401).json({message:"Token failed", error: error.message});
    }
};

//middleware for admin only access
const adminOnly = (res,req,next) =>{
    if(req.user && req.user.role == "admin"){
        next();
    }
    else{
        res.status(403).json({message:"Acess denied , admin only"});
    }
};
export {protect,adminOnly};
