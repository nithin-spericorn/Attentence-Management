const express=require("express");
const bodyParser=require('body-parser')
const cors=require ('cors')
const app=express()
const twilio=require("twilio")
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const ejs=require("ejs")
const fs=require("fs")
const db = require('./models/index');



var swaggerDefinition = {
  info: {
      title: 'AttentenceManagement',
      version: '2',
      description: '',

  },
  host:"bb2938618943.ngrok.io",//`localhost:7500`,
  basePath: '/api',
  schemes: [
      'http',
      'https'
  ],
  securityDefinitions: {
      Bearer: {
          type: 'apiKey',
          in: 'header',
          name: 'auth-token'
      }
  }

};
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./route/*.js'],
};

app.set('view engine', 'ejs');
const swaggerSpec = swaggerJSDoc(options);


const Route = require('./route/route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// route file require
app.use('/api',Route);

app.use(express.static(path.join(__dirname, 'public')));


db.sequelize.sync({force:false})
  .then(()=> console.log('successfully synced with DB'))
  .catch((err)=> console.log("Sync error", err))

  app.use('/am', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
/*app.use((req,res)=>{
  res.send("hello")
})*/
// set port, listen for requests
const port =require('./config/index').server.port
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});