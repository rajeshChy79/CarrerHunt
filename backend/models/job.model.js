import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  requirements:[
    {
      type:String
    }
  ],
  salary:{
    type:Number,
    required:true
  },
  location:{
    type:String,
    required:true
  },
// Example Mongoose Schema snippet (backend)
experienceLevel: {
    type: String, // CHANGE THIS FROM Number to String
    required: true,
    enum: ["Entry Level", "1-3 Years", "3-5 Years", "5-7 Years", "7+ Years"] // Optional: enforce specific string values
},
  jobType:{
    type:String,
    required:true
  },
  position:{
    type:String,
    required:true
  },
  company:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Company',
    required:true
  },
  created_by:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  applications:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Application'
  }],
},{timestamps:true});

export const Job=mongoose.model('Job',jobSchema);