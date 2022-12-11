//import
import scloudjs from "scloudjs";
import dotenv from "dotenv";
import * as encoder from "./libraries/encoder.js";
import * as parse from "./libraries/imageparser.js";
import request from "./libraries/request.js";
const secret =dotenv.config().parsed;

//tools to controll cloud variables
let clouddatas = new Object();
let time=0;
const valnames = ["HOST_1","HOST_2","HOST_3","HOST_4","HOST_5","HOST_6","HOST_7","HOST_8"];
const configvals = (vals)=>{
  for(let i=0;i<8;i++){
    if(vals[i]!=null){
      sendval(valnames[i],vals[i]);
    }
  }
};
const sendval = (name,value)=>{
  scloudjs.sendtocloud(name,value);
  clouddatas[name].value =value;
  
};


{
//controll cloud variables
const process = (data)=>{
  console.log("Get");
   const temp = scloudjs.parsedata(data,clouddatas);
   clouddatas = temp.clouddatas;
   const changedlists = temp.changedlists;
   if(time==0){
    time=1;
   }else{
    if(changedlists.indexOf("CLIENT")!=-1){
      const client = clouddatas.CLIENT.value;
      const reqtype=parseInt(client.charAt(0));
      const reqbody = client.substring(1);
      if(reqtype==0){
        //ping
        sendval("HOST_1","2"+randomnumber());
      };
      if(reqtype==1){
      };

      }
   }

};

scloudjs.setdatas(secret.username,secret.password,secret.projectid,process);
}
const func = async()=>{

    await scloudjs.login();
    console.log("Logged in to scratch account");
    await scloudjs.connect();
    console.log("Connected to server");
    await scloudjs.handshake();
};
func();

