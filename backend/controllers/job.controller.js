import { Job } from "../models/job.model.js";

//admin post the job
export const postJob=async(req,resp)=>{
  try{
    const userId=req.id;
    const {title,description,location,companyId,jobType,requirements,salary,position,experience}=req.body;
    if(!title || !description || !location || !companyId || !jobType || !requirements || !salary || !position || !experience){
      return resp.status(400).json({
        message:"Please fill all the fields",
        success:false
      })
    }
    const job=await Job.create({
      title,
      description,
      location,
      company:companyId,
      jobType,
      experienceLevel:experience,
      salary:Number(salary),
      position,
      requirements:requirements.split(","),
      created_by:userId,
    })

    return resp.status(201).json({
      message:"Job posted successfully",
      success:true,
      job
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

//student apply for the job
export const getAllJobs=async(req,resp)=>{
  try{
    const keyword=req.query.keyword || "";
    const Query={
      title:{
        $regex:keyword,
        $options:"i"
      },
      description:{
        $regex:keyword,
        $options:"i"
      }
    }

    const jobs=await Job.find(Query).populate({
      path:"company"
    }).sort({createdAt:-1});
    if(!jobs || jobs.length===0){
      return resp.status(404).json({
        message:"No jobs found",
        success:false
      })
    }
    return resp.status(200).json({
      message:"Jobs fetched successfully",
      success:true,
      jobs
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

//student apply for the job
export const getJobById=async(req,resp)=>{
  try{
    const jobId=req.params.id;
    if(!jobId){
      return resp.status(400).json({
        message:"Please provide job id",
        success:false
      })
    }
    const job=await Job.findById(jobId).populate({
      path:"applications"
    });
    console.log(job);
    if(!job){
      return resp.status(404).json({
        message:"Job not found",
        success:false
      })
    }
    return resp.status(200).json({
      message:"Job fetched successfully",
      success:true,
      job
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

//admin kitna job create kara
export const getAdminJobs=async(req,resp)=>{
  try{
    const adminId=req.id;
    const jobs=await Job.find({created_by:adminId}).populate({
      path:"company",
      createdAt:-1
    });
    if(!jobs){
      return resp.status(404).json({
        message:"job not found",
        success:false
      })
    }

    return resp.status(200).json({
      jobs,success:true
    })
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
}