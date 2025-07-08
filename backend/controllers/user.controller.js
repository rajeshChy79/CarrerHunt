import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"; // ✅ don't forget to import bcrypt
import jwt from "jsonwebtoken"; // ✅ don't forget to import jsonwebtoken
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, resp) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;


    if (!fullName || !email || !password || !phoneNumber || !role) {
      return resp.status(400).json({
        message: "Please fill all the fields",
        success: false
      });
    }   

    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return resp.status(400).json({
        message: "User already exists",
        success: false
      });       
    }

    const hashedPassword = await bcrypt.hash(password, 10);  

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
      profile:{
        profilePic:cloudResponse.secure_url
      }
    });

    return resp.status(201).json({
      message: "User registered successfully",
      success: true,
      user:newUser
    });

  } catch (error) {
    console.error(error);
    return resp.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

export const login=async(req,resp)=>{
  try{
    const {email,password,role}=req.body;
    if(!email || !password || !role){
      return resp.status(400).json({
        message:"Please fill all the fields",
        success:false
      });
    }

    let user=await User.findOne({email});
    if(!user){
      return resp.status(400).json({
        message:"User not found",
        success:false
      });
    }

    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
      return resp.status(400).json({
        message:"Invalid credentials",
        success:false
      });
    }

    if(role!==user.role){
      return resp.status(400).json({
        message:"Invalid credentials",
        success:false
      });
    }
    const tokenData={
        userId:user._id
    }

    const token=await jwt.sign(tokenData,process.env.JWT_SECRET_KEY,{expiresIn:"1d"});

    user={
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      phoneNumber:user.phoneNumber,
      role:user.role,
      profile:user.profile,
    }
    return resp.status(200).cookie('token',token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'None',secure:true}).json({
      message:`welcome back ${user.fullName}`,
      user,
      success:true
    })
  }
  catch(error){
    console.error(error);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    });
  }
}

export const logout=async(req,resp)=>{
  try{
    return resp.status(200).cookie('token',"",{maxAge:0}).json({
      message:"Logged out successfully",
      success:true
    })
  }
  catch(error){
    console.error(error);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    });
  }
}

export const updateProfile=async(req,resp)=>{
  try{
    const {fullName,email,phoneNumber,bio,skills}=req.body;

    //cloudinary
    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content)

    let skillsArray;
    console.log("skills",skills)
    if(skills){
      skillsArray=skills.split(",");
      console.log(skillsArray);
    }

    const userId=req.id;
    let user=await User.findById(userId);
    if(!user){
      return resp.status(400).json({
        message:"User not found",
        success:false
      });
    }
    if(fullName) user.fullName=fullName;
    if(email) user.email=email;
    if(phoneNumber) user.phoneNumber=phoneNumber;
    if(bio) user.profile.bio=bio;
    if(skills) user.profile.skills=skillsArray;

    //resume
    if(cloudResponse){
      console.log("cloudResponse",cloudResponse);
      user.profile.resume=cloudResponse.secure_url
      user.profile.resumeOriginalName=file.originalname;
    }

    await user.save();
    user={
      _id:user._id,
      fullName:user.fullName,
      email:user.email,
      phoneNumber:user.phoneNumber,
      role:user.role,
      profile:user.profile,
    }

    return resp.status(200).json({
      message:"Profile updated successfully",
      user,
      success:true
    })  
  }
  catch(error){
    console.error(error);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    });
  }
}
