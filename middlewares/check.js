const jwt = require('jsonwebtoken')
const db = require("../models/index")
const env = process.env.NODE_ENV || 'local';
const c=require("../config/config.json")[env]

module.exports.checkToken = async (req, res, next) => {
    
    const token = req.header('auth-token');
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "no token provided"
        })
    }
    
    try {
       
        //console.log(c.local.SECRET)
        console.log("hai")
        const secret='secret'//c.local.SECRET/
        const getEmail= jwt.verify(token, secret)
         const result=await db.user.findOne({ where: { email: getEmail.email }, raw: true })
            if(result)
            {
               req.user = result
                return next()
            }
            else 
            {
                return res.status(401).json({
                    success: false,
                    message: "no user found"
                })
            }
        
       
    }
    catch (error) {
        //console.log(error);
        return res.status(401).json({
            success: false,
            message: "invalid token"
        })
    }
},
module.exports.checkAdmin= async (req,res,next)=>{
    const token = req.header('auth-token');
    try{
        const secret=config.SECRET
        const getEmail= jwt.verify(token, secret)

        console.log(getEmail.email)
        const User= await db.user.findOne({ where: { email: getEmail.email }, raw: true })
        console.log("loo")
            if(User.role_id===1)
            {
                console.log("next")
                return next()
            }
            else 
            {
                return res.status(401).json({
                    success: false,
                    message: "you are not authorized person"
                })
            }
         
        
       
    }
    catch (error) {
        //console.log(error);
        return res.status(401).json({
            success: false,
            message: "invalid token"
        })
    }

},
module.exports.blockcheck= async(req,res,next)=>{
    
    try{
       
        let n=await db.user.findOne({where:{email:req.user.email}})//req.body.email}})
        console.log("uuu")
        let m=n.user_id
        const {id} =req.params||m
        console.log(id)
    const User =  await db.user.findOne({where:{user_id:id}})
    console.log(User)
        if(User.action===1){
            next()
        }else{
            return res.status(201).json({
                success: false,
                message: "your are blocked"
        })
    }
    }catch(error){
        return res.status(201).json({
            success: false,
            message:"something wet wrong"
    })
    }
   

}