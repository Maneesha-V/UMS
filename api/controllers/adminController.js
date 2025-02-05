import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"


export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find({},"-password");
        res.status(200).json(users);
    }catch(err){
        next(errorHandler(500,"Server error"))
    }
}
export const adminUpdateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email } = req.body; 
    try{
        let user = await User.findById(id);
        if(!user) return next(errorHandler(404,"User not found"));
        user.username = username || user.username;
        user.email = email || user.email;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    }catch(err){
        next(errorHandler(500,"Server error"))
    }
}