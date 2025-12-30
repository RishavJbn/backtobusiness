import jwt from "jsonwebtoken";

const generateTokem = (userId) =>{
    return jwt.sign(
        {id: userId},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    ) 
};

const registerUser = async (req,res) =>{};

const loginUser = async (req,res) =>{};

const getUserProfile = async (req,res) =>{};

const updateUserProfile = async (req,res) =>{};

export {registerUser,loginUser,getUserProfile,updateUserProfile};