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