const db = require("../models");
const nodemailer=require("nodemailer")
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const moment=require("moment");
const { get } = require("../route/route");
const {Op}=require("sequelize")
const env = process.env.NODE_ENV || 'local';
const c=require("../config/config.json")[env]
const ejs=require("ejs")
const fs=require("fs")


const accountSID = 'AC5d169cc3d0850c1354200c8ac0f897f2'//process.env.TWILIO_ACCOUNT_SID;
const authToken= '6d2833d043e5478318c1d3da000151c2'//process.env.TWILIO_AUTH_TOKEN;
const client=require("twilio")(accountSID,authToken)

const serviceSID="VA6e57160d74327c545d93e0b2400c2781"
const ASID="AC44fe28e84752ac03c1268d0e067b8579"
const AuToken="e953bd56afc44839782dc08074c1d676"
const client2=require("twilio")(ASID,AuToken)
let M;


const AdminPassword = "admin";



module.exports = {
  otpn: async (req, res) => {
    try {

     let Mobile = req.body.mobile
   
      console.log(Mobile);
      const user = await db.user.findOne({ where: { mobile: Mobile } });
      if (!user) {
        res.status(500).json({
          success: false,
          message: "No such user"
        })
      

      } else {
        M=Mobile;
      client2.verify.services(serviceSID).verifications.create({
        to:Mobile,
        channel:"sms" 
      })
      res.status(200).json({
        success:true,
        message:"otp sent successfully"
      })
      }


    }catch (error) {
      res.status(404).json({
        success:false,
        message:"something went wrong"
      })

    }
    },
  votpn:async (req,res)=>{
    const data=req.body;
    console.log(data)
    const code = data.code;
    console.log(code)
    const newpassword=data.newpassword;
    const hashed_password = await bcryptjs.hash(newpassword,10);
    client2.verify.services(serviceSID).verificationChecks.create({
      to:M,
      code:code
    })
    .then((resp) => {
     console.log("otp res", resp);
     if (resp.valid) 
      db.user.update({password:hashed_password},{where:{mobile:M}})
      res.status(200).json({
        success:true,
        message:"otp verifyed and update the new password"
  })
})
    
  },
    createAdmin: async (req, res) => {
      try {
        
        const salt = await bcryptjs.genSalt(10);
         const hashed_password = await bcryptjs.hash(AdminPassword,10);
         const admincredential = {
          name: "admin",
          mobile:req.body.mobile||"+916282962840",
          profession:"administrator",
          company:"spericorn",
          experience:10,
          email: "admin@gmail.com",
          password: hashed_password,
          leaveStatus:"present",
          role_id:1,
          action:req.body.action||1,
          start_time:new Date(),
          end_time:new Date(),
         


        };
        
          console.log("hai") 
         const g = await db.user.create(admincredential)
             if(!g){
              console.log(error)
                return res.status(400).json({
                    success: false,
                    message: "admin seeded not successfully",
                  });   
             }

             else{ 
             
               
                return res.status(201).json({
                    success: true,
                    message: "admin creadential saved",
                  });  
             }
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "something went wrong",
        });
      }
    },
    signup:async (req,res)=>{
      const e=req.body.email;
      console.log(e)
      let html = await ejs.renderFile("view/message.ejs");  
      const message = {
        from: "nithinpj333@gmail.com",
        to: e,
        replyTo: e,
        subject: "Registration_successful",
        html:html
      };
     console.log("1")
      const transport = nodemailer.createTransport({ port: 465,
        host: "smtp.gmail.com",
        secure:true,
        auth:{
          user:"nithinpj333@gmail.com",
          pass: "949569102329"}})
        try{
                const t= await db.user.findOne({where:{email:req.body.email}})
                  const salt = await bcryptjs.genSalt(10);
                  const hash = await bcryptjs.hash(req.body.password, 12);
                  const users = {
                    name: req.body.name,
                    email: req.body.email,
                    password: hash,
                    role_id:req.body.role_id||0,
                    action:1,
                    mobile:req.body.mobile||"+916282962840"
                   /* leave_Status:null,
                    start_time:null,
                    end_time:null*/
                  };
                  
                  //await db.user.findOne()
        
                  if(t)
                  {
                      return res.status(400).json({message:"email already exist"})
                  }else{
           const h= await db.user.create(users)
                      if(h)
                      {
                        
                       //creating the mail
                       // const html = await ejs.renderFile("template/forgot_mail.ejs"); 
                       let html = await ejs.renderFile("view/message.ejs");    
   
     //send email
      await transport.sendMail(message,function (err,info){
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });
     /* client.messages.create({
        to:req.body.mobile,
        from:+15706309416,
        body:'you successfully registered'
      }).then((message)=>console.log(message.sid))*/

      return res.status(200).json({message:"user registration successfull"})
                      }
                      else if(!h)
                      {
                        console.log("hai")
                      return res.status(400).json({message:"unsuccessful registration"})
                      }
                    }

        }catch (error) {
                return res.status(500).json({
                  success: false,
                  message: "something went wrong",
                });
              }
    },
    login: async (req, res) => {
      console.log("jj")
        try {
         
          const data = await db.user.findOne({ where: { email: req.body.email } });
          console.log("pp")
          if (data) {
            bcryptjs.compare(req.body.password, data.password, (err, result) => {
              if (result) {
                
               
                const token = jwt.sign(
                  {
                    email: data.email,
                    id:data.user_id
                  },
                  "secret"
                );
               console.log(token)
                res.status(200).json({
                  success: true,
                  message: "authentication successfull",
                  token: token,
                });
    
              } else {
                res.status(400).json({
                  success: false,
                  message: "invalid credentials",
                });
               
              }
            });
           
          } else {
            res.status(401).json({
              success: false,
              message: "No User Found",
            });
           
          }
        } catch (error) {
          res.status(500).json({
            success: false,
            message: "something went wrong",
          });
        }
      },
      getProfile : async (req,res)=>{
    
         try{
              const {id} = req.params
              console.log(id)
              const data= await db.user.findOne({where : {user_id:id}},{ attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }})
             /*{ attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }},*/
                  if(data){
                    console.log(id)
                    res.status(200).json({
                        success: true,
                        message: data,
                      }); 
                  }else if(!f){
                    res.status(400).json({
                      success: false,
                      message: "sorry",
                    }); 
                  }

          }catch (error) {
          res.status(500).json({
            success: false,
            message: "something went wrong ",
          });
        }
      },
    chkin : async (req,res)=>{
     
        try{
          
            const {id} = req.params
            console.log(id)
            const attentenceStatus=req.body.leaveStatus||"present"
            let sd=new Date()
            const date=req.body.start_time||moment(sd).format('MM/DD/YYYY');
            console.log(date)
            
          
           const user= await db.user.update({leaveStatus:attentenceStatus,start_time:sd},{where:{user_id:id}})// is not working?
           console.log(user)
           await db.leave.create({user_id:req.user.user_id,
            leaveStatus:attentenceStatus,
            date:date
              })
              res.status(200).json({
                success: true,
                message:"Attentence Status Marked",
              });
           
              

        }catch (error) {
          console.log(error)
        res.status(500).json({
          success: false,
          message: error.message
        });
      }
    },
    update : async (req,res)=>{
        try{
            const {id} = req.params
          console.log(id)
               const data=req.body;
               console.log(data)
               const name=data.name
               const profession = data.profession
               console.log(profession)
               const company = data.company
               console.log(company)
               const experience=data.experience
               console.log(experience)
               const mobile=data.mobile
                console.log("before")
          const d =  await db.user.update({name:name,profession:profession,company:company,experience:experience,mobile:mobile},{where : {user_id:id}})
                   if(d)
                   res.status(200).json({message:"updated successfuly"})
                   else
                   res.status(400).json({message:"sorry"})
         

        }catch (error) {
        res.status(500).json({
          success: false,
          message: error,
        });
      }
    },
    listAll : async (req,res)=>{
        try{ 
          console.log("kkk") 
            const User= await db.user.findAll( { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }})  
            console.log(User)
            res.status(200).json({
              success: true,
              message: User,
            }); 
          

        }catch (error) {
        res.status(500).json({
          success: false,
          message: error,
        });
      }
    },

 block: async (req,res)=>{
  try{

  
   const id = req.body.id
  
   const action=req.body.action
   const date=req.body.date;
   const d =  await db.user.update({action:action},{where : {user_id:id}})
   if(d)
   console.log("action updated")
   res.status(200).json({
    success: true,
    message: "blocked the user",
  }); 
  }catch(error){
    console.log(error)
  }
    
},
remove: async (req,res)=>{
  try{
    const userId= req.body.id;
    console.log(userId)
    const remove= await db.user.destroy({where:{user_id:userId}})
    if(remove){
      res.status(200).json({
        success: true,
        message: "user delete successfully",
      }); 
    }
  }catch(error){
    res.status(401).json({
      success: false,
      message: error,
    }); 
  }
 

},

getAt:async(req,res)=>{
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const d = new Date();
const pm=d.getMonth()
let currentMonth= monthNames[pm-1];
let CM=currentMonth;
let maxday=0

try{
  let a=[];
  const x=await db.user.findOne({where:{user_id:2}})
  
  let start=x.createdAt
      //let start=new Date('2021-01-01T09:55:13.000Z')//x.startTime
      
      let mothnum=start.getMonth()
      let fm=monthNames[start.getMonth()]
      console.log(start)
      console.log(mothnum)
      for(let i=mothnum;i<pm;i++){
        let count=0;
        let q=monthNames[i]
        if(q==="January"||q==="March"||q==="May"||q==="July"||q==="August"||q==="October"||q==="December"){
          maxday=31
          
          }
          else if(q==="April"||q==="June"||q==="September"||q==="November"){
            maxday=30
          }
          else if(q==="February"){
            maxday=28
          }
        let r=i
        //console.log(monthNames[i],maxday)
        for(let dy=1;dy<=maxday;dy++){
          let b=dy
          if(b<10){
            b="0"+dy
          }
          if(r<10){
            r="0"+i
          }

          let makedate=`${r+'/'+b+'/'+2021}`
          console.log(makedate)
          const p=await db.leave.findOne({where:{user_id:2,date:makedate}})
          if(p){
            count++;
          }

          
        }
        let v=`${monthNames[i]}`;
        let mxd=`${maxday}`;
        a.push(`${v} `+":"+count)
        
        console.log(`total attentence in ${monthNames[i]}:${count} out of ${maxday} days` )
        console.log(a[1])
        
      }
  res.status(200).json({
          success: true,
          message: a,
        }); 
  }
 
catch(error){
  res.status(401).json({
    success: false,
    message: error,
  }); 
}
},
WA:async (req,res)=>{
  let array=[];
  let makedate
  let mx
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let d = new Date()
  let dayNumber = d.getDay();
  let cd=d.getDate()
  const cm=d.getMonth()
  const cy=d.getFullYear()
  console.log(dayNumber)
  console.log(cd)
  if(dayNumber===0)
  {
    res.status(401).json({
      success: false,
      message: "Today is Sunday",
    });
  }
  else
  mx = dayNumber 
  for(let i=0;i<mx;i++){
   let fromday= cd-dayNumber
   
   if(fromday<10)
   {
     fromday="0"+fromday
   }
   makedate = "0"+`${cm+1}/${fromday}/${cy}`
   console.log(makedate)
   dayNumber=dayNumber-1;
   
    let p = await db.leave.count({where:{date:makedate}})
    if(p>0)
    console.log(p)
   let x=days[i]
   let f=`${x}`;
   
       array.push(`${x} =` +" "+ p) 
       p=0;    
  }
  
  res.status(200).json({
    success: true,
    message: array,
  });
},
checkout:async (req,res)=>{
  try{
    const {id}=req.params
    let endTime=new Date()//moment().format("DD/MM/YYYY")
    const w=await db.user.findOne({where:{user_id:id}})
    let p=w.createdAt//start_time
    // current hours
let shours = p.getHours();

// current minutes
let sminutes = p.getMinutes();

// current seconds
let sseconds = p.getSeconds();
// current hours
let ehours = endTime.getHours();

// current minutes
let eminutes = endTime.getMinutes();

// current seconds
let eseconds = endTime.getSeconds();
  let th=ehours-shours;
  let tm=(eminutes-sminutes)
  let ts=(eseconds-sseconds)
  console.log(tm)
  if(th<10)
  {
    th="0"+th
  }
  if(tm<10)
  {
    tm="0"+tm
  }
  if(ts<10)
  {
    ts="0"+ts
  }
  let total=`${th}:${tm}:${ts}`

console.log(total)
    const c=await db.user.update({end_time:endTime},{where:{user_id:id}})
    if(c)
    {
      await db.user.update({ leaveStatus:null},{where:{user_id:id}})
      const r=await db.leave.update({work_duration:total},{where:{user_id:id}})
      console.log(r)
    }
    res.status(201).json({
      success: true,
      message: "checkout success",
    }); 

  }catch(error){
    res.status(401).json({
      success: false,
      message: error,
    }); 
  }
}
}
    