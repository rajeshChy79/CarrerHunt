import {Company} from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
export const registerCompany=async(req,resp)=>{
  try{
    const {companyName}=req.body;
    if(!companyName){
      return resp.status(400).json({
        message:"Please provide company name",
        success:false
      })
    }

    const company=await Company.findOne({name:companyName});
    if(company){
      return resp.status(400).json({
        message:"Company already exists",
        success:false
      })
    }

    const companyCreated=await Company.create({
      name:companyName,
      userId:req.id
    })
    return resp.status(201).json({
      message:"Company registered successfully",
      success:true,
      company:companyCreated
    })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const getCompany=async(req,resp)=>{
  try{
    const userId=req.id;
    const companies=await Company.find({userId});
    console.log(companies)
    if(!companies || companies.length===0){
      return resp.status(404).json({
        message:"No companies found",
        success:false
      })          
    }
    return resp.status(200).json({
      message:"Company fetched successfully",
      success:true,
      companies
    })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const getCompanyById=async(req,resp)=>{
  try{
    const companyId=req.params.id;
    const company=await Company.findById(companyId);
    if(!company){
      return resp.status(404).json({
        message:"Company not found",
        success:false
      })
    }

    resp.status(200).json({
      message:"Company fetched successfully",
      success:true,
      company
    })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const updateCompany=async(req,resp)=>{
  try{
    const {name,description,website,location}=req.body;
    const companyId=req.params.id;
    const file=req.file;
    const fileUri=getDataUri(file);
    const cloudResponse=await cloudinary.uploader.upload(fileUri.content);
    const logo=cloudResponse.secure_url

    const updateCompany={name,description,website,location,logo};
    const company=await Company.findByIdAndUpdate(companyId,updateCompany,{new:true});
    if(!company){
      return resp.status(404).json({
        message:"Company not found",
        success:false
      })
    }
    return resp.status(200).json({
      message:"Company updated successfully",
      success:true,
      company
    })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}