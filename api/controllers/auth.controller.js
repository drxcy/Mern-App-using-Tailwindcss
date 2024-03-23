import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const signup= async (req,res,next)=>
{
    const {username,email,password} = req.body;  
    if(!username || !email || !password || username==='' || email==='' || password==='')
    {
       next(errorHandler(500,'All Fields Required to Fills Field'));
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({
        username,
        email,
        password:hashedPassword,
    });
    try {
        await newUser.save();
        res.json("sign up successfully updated");
         } catch (err) {
       next(err);
    }
};
export const signin = async (req,res,next)=>
{
    const {email, password}=req.body;
    if(!email ||!password ||email==='' || password==='')
    {
       next(errorHandler(500,'All Fields Required to Fills Field'));
    }
   try {
    const checkUser= await User.findOne({email});
    if(!checkUser)
    {
       return next(errorHandler(404,'User Not Found'));
    }
    const isMatchPassword = bcryptjs.compareSync(password,checkUser.password);
   if(!isMatchPassword) {
   return next(errorHandler(401,'Invalid User Password!!'));
   }
   const token = jwt.sign({User_id:checkUser._id}
    ,process.env.JWT_SECRET);
    const {password:pass ,...rest}=checkUser._doc;
    res
    .status(200)
    .cookie('access_token',token,
    {
     httpOnly: true,   
    }).json(rest);

   } catch (err) {
    
   }

}