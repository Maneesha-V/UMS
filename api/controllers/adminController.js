import User from "../models/userModel.js"
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js"


export const getUsers = async (req, res, next) => {
    try{
        const users = await User.find({},"-password");
        res.status(200).json(users);
    }catch(err){
        next(errorHandler(500,"Server error"))
    }
}
export const adminCreateUser = async (req, res, next) => {
    try{
        console.log("body",req.body);
        const { username, email, password, isAdmin } = req.body;
        if(!username || !email || !password){
            next(errorHandler(400,"All fields are required"));
            return;
        }
        const existingUser = await User.findOne({email});
        console.log("existingUser",existingUser);
        if (existingUser) {
            next(errorHandler(400,"User already exists"));
            return;
        }
        const hashedPassword = await bcryptjs.hashSync(password,10);
        const newUser = new User({username, email, password: hashedPassword, isAdmin})
        await newUser.save();
        res.status(201).json(newUser);
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
export const adminDeleteUser = async (req, res, next) => {
    const { id } = req.params;
    try{
        const user = await User.findByIdAndDelete(id);

        if (!user) {
          return next(errorHandler(404, "User not found"));
        }
    
        res.status(200).json({ success: true, message: "User deleted successfully" });
    }catch(err){
        next(errorHandler(500,"Server error"))
    }
}