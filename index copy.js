//import
import scloudjs from "scloudjs";
import dotenv from "dotenv";
import * as encoder from "./libraries/encoder.js";
const secret =dotenv.config().parsed;

//tools to controll cloud variables
let clouddatas = new Object();
let time=0;
const hostvals = ["HOST_1","HOST_2","HOST_3","HOST_4","HOST_5","HOST_6","HOST_7","HOST_8"];
encoder
const configvals = (vals)=>{
  for(let i=0;i<8;i++){
    if(vals[i]!=null){
      sendval(i,vals[i]);
    }
  }
};
const sendval = (num,value)=>{
  scloudjs.sendtocloud(hostvals[num],value);
  clouddatas[hostvals[num]].value =value;
  
};
const sendonlystatus=(code)=>{
  sendval(0,encoder.randomnumber()+code);
}

{
//controll cloud variables
const process = (data)=>{
   const temp = scloudjs.parsedata(data,clouddatas);
   clouddatas = temp.clouddatas;
   const changedlists = temp.changedlists;
   if(time==0){
    time=1;
   }else{
    let templ;
    if(changedlists.indexOf("CLIENT")!=-1){
      let i=0;
      templ = encoder.readint(clouddatas.CLIENT.value,i);
      i=templ.i;
      const reqaddress = templ.data;
      templ = encoder.readint(clouddatas.CLIENT.value,i);
      i=templ.i;
      const reqbody = templ.data;
      if(reqaddress==0){
        sendonlystatus(1);
      };
      if(reqaddress==1){

      }

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

