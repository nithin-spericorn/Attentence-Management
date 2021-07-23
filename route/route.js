const { checkToken,checkAdmin,blockcheck} = require('../middlewares/check');

const express = require('express')
const router = express.Router();
const {createAdmin,signup,login,getProfile,chkin,update,listAll,block,remove,getAt,checkout,otpn,votpn,WA}=require("../controller/adminController")
/**
 * @swagger
 *  /admin:
 *      post:
 *          tags:
 *              -   Seed
 *          description: Seed admin creadential             
 *          responses:
 *              200 :
 *                  description: seeded successfull
 *
 *
 */
router.post('/admin', createAdmin)
/**
 * @swagger
 *  /signup:
 *      post:
 *          tags:
 *              -   Auth
 *          description: Signup
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: All fields are required.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          name:
 *                              type: string
 *                              required: true,
 *                              example: "nithin"
 *                          email:
 *                              type: string
 *                              required: true,
 *                              example: "jose@gmail.com"
 *                          mobile:
 *                              type: string
 *                              required: true,
 *                              example: "+916282962840"
 *                          password:
 *                              type: string,
 *                              required: true,
 *                              example: "jose123"                                    
 *          responses:
 *              200 :
 *                  description: login successfull
 *
 *
 */

router.post('/signup',signup)
/**
 * @swagger
 *  /login:
 *      post:
 *          tags:
 *              -   Auth
 *          description: login
 *          parameters:
 *              -   in: body
 *                  name : request body
 *                  description: All fields are required.
 *                  type: object
 *                  schema:
 *                      properties:
 *                          email:
 *                              type: string
 *                              required: true,
 *                              example: "nithin@gmail.com"
 *                          password:
 *                              type: string,
 *                              required: true,
 *                              example: "nithin123"                   
 *          responses:
 *              200 :
 *                  description: Singup successfull
 *
 *
 */
router.post('/login',login)

/**
 * @swagger
 *  /getuser/{id}:
 *       get:
 *          security:
 *              -  Bearer: []
 *          tags:
 *              - Profile
 *          description: get profile
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: number
 *                  required: true
 *                  description: UserId 
 * 
 * 
 *                                   
 *          responses:
 *              200 :
 *                  description: get profile successfull
 *
 *
 */
router.get('/getuser/:id',checkToken,getProfile)
/**
 * @swagger
 *  /checkin/{id}:
 *      put:
 *           security:
 *              -  Bearer: []
 *           tags:
 *              -   Check in
 *           description: Mark your Attenyence
 *           parameters:
 *               -   in: path
 *                   name: id
 *                   type: number
 *               -   in: body
 *                   name : request body
 *                   description: All fields are required.
 *                   type: object
 *                   schema:
 *                       properties:
 *                           leaveStatus:
 *                              type: string
 *                              required: true,
 *                              example: "present"
 *                                                            
 *           responses:
 *               200 :
 *                   description: successfully check in
 *
 *
 */


router.put('/checkin/:id',checkToken, chkin)

/**
 * @swagger
 * /update/{id}:
 *      put:
 *          security:
 *              -  Bearer: []
 *          tags:
 *              - Update Profile
 *          description: Update 
 * 
 *          parameters:
 *              -   in: path
 *                  name : id
 *                  type : number
 *                  required : true
 *                  description: User Id required.
 *              -   in: body
 *                  name: request body
 *                  description: enter your new profile name for update
 *                  type: object
 *                  schema:
 *                       properties:
 *                             name:
 *                              type: string
 *                              required: true,
 *                              example: "joseph PJ"
 * 
 *                                   
 *          responses:
 *              200 :
 *                  description: user profile update successfully
 *
 *
 */
router.put('/update/:id',checkToken,blockcheck, update)
/**
 * @swagger
 *   /ls:
 *      get:
 *          security:
 *              - Bearer: []
 *          tags:
 *              -   Get All Users
 *          description: User listing
 *          
 *                                            
 *          responses:
 *              200 :
 *                  description: Fetched User list
 *
 */
router.get('/ls',checkToken,checkAdmin,listAll)

/**
 * @swagger
 * /block:
 *      put:
 *          security:
 *              -  Bearer: []
 *          tags:
 *              - Block 
 *          description: Block the user
 * 
 *          parameters:
 *              -   in: body
 *                  name: request body
 *                  description: enter id of the user for block
 *                  type: object
 *                  schema:
 *                       properties:
 *                            id:
 *                              type: number
 *                              required: true,
 *                              example:  2
 * 
 *                                   
 *          responses:
 *              200 :
 *                  description: user profile update successfully
 *
 *
 */
router.put('/block',checkToken,checkAdmin,block)
/**
 * @swagger
 *  /d:
 *      delete:
 *           security:
 *              -  Bearer: []
 *           tags:
 *              -   Delete
 *           description: delete the user
 *           parameters:
 *               -   in: body
 *                   name : request body
 *                   description: user id fields are required.
 *                   type: object
 *                   schema:
 *                       properties:
 *                           id:
 *                              type: number
 *                              required: true,
 *                              example:  2
 *                                                            
 *           responses:
 *               200 :
 *                   description: delete the user sussfully
 *
 *
 */
router.delete('/d',checkToken,checkAdmin,remove);
/**
 * @swagger
 *  /getAt/{id}:
 *       get:
 *          security:
 *              -  Bearer: []
 *          tags:
 *              - Attentence
 *          description: get monthly attentence
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: number
 *                  required: true
 *                  description: UserId 
 * 
 * 
 *                                   
 *          responses:
 *              200 :
 *                  description: get profile successfull
 *
 *
 */
router.get('/getAt/:id',checkToken,getAt)
/**
 * @swagger
 *  /chout/{id}:
 *       put:
 *          security:
 *              -  Bearer: []
 *          tags:
 *              - Checkout
 *          description: check out
 *          parameters:
 *              -   in: path
 *                  name: id
 *                  type: number
 *                  required: true
 *                  description: UserId 
 * 
 * 
 *                                   
 *          responses:
 *              200 :
 *                  description: check out successful
 *
 *
 */
router.put("/chout/:id",checkout)
router.post("/callotpn",otpn)
router.post("/votpn",votpn)
router.get("/attentence",WA)
module.exports = router;