import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from'bcryptjs';

export const test=(req,res)=>
{
    res.json({message:"test api is working properly"})
}
export const upadateUser = async (req,res,next)=>
{ 
    if (!req.user) {
        return next(errorHandler(401, "You must be logged in to update a user"));
      }
    
     if(req.user.User_id !== req.params.userId)
    {
        console.log(req.user.id+ " is already" + req.params.userId);
        console.log(req.user.User_id+ " is already" + req.params.userId);
        console.log(req.user);
        
        return next(errorHandler(403,"You are not allowed to udpate an existing user"));
        
    }
    if(req.body.password)
    {
        if(req.body.password.length<6)
        {
            return next(errorHandler(400,"Your password must be at least 6 characters long"));
        }
        req.body.password =bcryptjs.hashSync(req.body.password,10)
    }
    if(req.body.username)
    {
        // console.log(req.body.username);
        console.log(req.body.username.length);
        if(req.body.username.length < 7 || req.body.username.length>20)
        {
            return next(errorHandler(400,"Your username must be between 20 and 7 characters long"));
        }
        if(req.body.username.includes(' '))
        {
            return next(errorHandler(400,"Your username cannot contain spaces"));
        }
        if(req.body.username != req.body.username.toLowerCase())
        {
            return next(errorHandler(400,"Your username must be all lowercase"));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/))
        {
            return next(errorHandler(400,"Your username must cannot special characters"));
        }
    }        
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId,
                {
                $set: {
                    username:req.body.username,
                    email:req.body.email,
                    imageUrl:req.body.imageUrl,
                    password:req.body.password,
                },
            },
            {new:true});
            const {password,...rest} = updatedUser._doc;
            res.status(200).json(rest);

        } catch (err) {
            next(err);
        }
    }

export const deleteUser =  async (req, res,next) => {
    if(req.user.User_id!==req.params.userId)
    {
        return next(errorHandler(403,"You are not allowed to udpate an existing user"));
    }
    try {
         await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted successfully");
    } catch (err) {
        next(err);
    }

}
export const signout = async (req, res,next) => {
    try {
        res.clearCookie("access_token").status(200).json("Successfully signed out",);
    } catch (error) {
        next(error);
        
    }
};