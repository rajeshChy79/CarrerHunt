import jwt from "jsonwebtoken";
const isAuthenticated=(req,resp,next)=>{
  try{
    const token=req.cookies.token;
    console.log(token)
    if(!token){
      return resp.status(401).json({
        message:"Please login to access this resource",
        success:false
      })
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decoded){
      return resp.status(401).json({
        message:"Invalid token",
        success:false
      })
    }
    req.id=decoded.userId;
    next();
  }
  catch(err){
    console.error(err);
    return resp.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
}

export default isAuthenticated;