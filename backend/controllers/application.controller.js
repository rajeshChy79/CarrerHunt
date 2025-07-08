import express from "express";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJobs=async(req,resp)=>{
   try{
      const userId=req.id;
      const jobId=req.params.id;
      if(!jobId){
        return resp.status(400).json({
          message:"job id is required",
          success:false
        })
      }

      //check if user is already applied for the job or not
      const existingApplication=await Application.findOne({job:jobId,applicant:userId});
      if(existingApplication){
        return resp.status(400).json({
          message:"you have already applied for the job",
          success:false
        })
      }

      //check if the job exists 
      const job=await Job.findById(jobId);
      if(!job){
        return resp.status(400).json({
          message:"job not found",
          success:false
        })
      }

      //create a new application
      const newApplication=await Application.create({
        job:jobId,
        applicant:userId
      })

      job.applications.push(newApplication._id);
      await job.save();
      return resp.status(201).json({
        message:"job applied successfully",
        success:true
      })
   }
   catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"internal server error",
      success:false
    })
   }
}

export const getAppliedJobs=async(req,resp)=>{
  try{
    const userId=req.id;
    const appliedJobs = await Application.find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: 'job',
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'company',
        options: { sort: { createdAt: -1 } },
      },
    });
  

    if(!appliedJobs){
      return resp.status(404).json({
        message:"No applications",
        success:false
      })
    }

    return resp.status(200).json({
      appliedJobs,
      success:true
    })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"internal server error",
      success:false
    })
  }
}

//admin checks how much applicant applied for job
export const getApplicants=async(req,resp)=>{
  try{
      const jobId=req.params.id;

      const job = await Job.findById(jobId)
      .populate({
        path: 'applications',
        options: { sort: { createdAt: -1 } },
        populate: {
          path: 'applicant',
        }
      });
    

      if(!job){
        return resp.status(404).json({
          message:"job not found",
          success:false
        })
      }

      return resp.status(200).json({
        job,
        success:true
      })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"internal server error",
      success:false
    })
  }
}

export const updateStatus=async(req,resp)=>{
  try{
     const {status}=req.body;
     console.log("status:",status);
     console.log(req.params.id)
     const applicationId=req.params.id;
     if(!status){
      return resp.status(400).json({
        message:"status is required",
        success:false
      })
     }

     //find the application by applicantion id
     const application=await Application.findOne({_id:applicationId});
     if(!application){
      return resp.status(404).json({
        message:"application not found",
        success:false
      })
     }

     application.status=status.toLowerCase();
     await application.save();

     return resp.status(200).json({
      message:"status updated successfully",
      success:true
     })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"internal server error",
      success:false
  })
}
}