//import
import scloudjs from "scloudjs";
import dotenv from "dotenv";
import * as encoder from "./libraries/encoder.js";
import * as parse from "./libraries/imageparser.js";
import request from "./libraries/request.js";
const secret =dotenv.config().parsed;
let set=[];


const randomnumber = ()=>{
  return (Math.floor(Math.random()*900000)+100000).toString();
}
//tools to controll cloud variables
let clouddatas = new Object();
let time=0;
const hostvals = ["HOST_1","HOST_2","HOST_3","HOST_4","HOST_5","HOST_6","HOST_7","HOST_8"];
const configvals = (vals)=>{
  for(let i=0;i<8;i++){
    if(vals[i]!=null){
      sendval(hostvals[i],vals[i]);
    }
  }
};
const sendval = (name,value)=>{
  scloudjs.sendtocloud(name,value);
  clouddatas[name].value =value;
  
};
{
let i;
const sender =()=>{
  let eight=[];
  for(let ii=0;ii<8;ii++){
    if(ii+i<set.length){
      eight.push(set[ii+i]);
    }else{
      eight.push(null);
    }
  };
  setTimeout(() => {
    configvals(eight);
    i+=8;
    
  }, 500);

}
//controll cloud variables
const process = (data)=>{
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
        sender();
      };
      if(2<=reqtype<=4){
        const createlink = new Promise((resolve,reject)=>{
          if(reqtype==2){
            request(`https://api.scratch.mit.edu/users/${encoder.readstr(reqbody)[0]}/`).then(res=>{
              const userid = JSON.parse(Buffer.from(res,"utf-8").toString()).id;
              resolve(`https://uploads.scratch.mit.edu/get_image/user/${userid}_60x60.png`);
            }).catch(()=>{reject();});
          } else if(reqtype==3){
            resolve(`https://uploads.scratch.mit.edu/get_image/project/${encoder.readint(reqbody)[0]}_144x108.png`); 
          }else if(reqtype==4){
            resolve(`https://uploads.scratch.mit.edu/get_image/gallery/${encoder.readint(reqbody)[0]}_144x108.png`); 
          }
        }).then(res=>{
          parse.getimagedata(res).then(res=>{
            let str ="";
            for(let i=0;i<res.datas.length;i++){
              str = str+encoder.writeint(res.datas[i]);
            };
            let ii=0;
            console.log(str.length);
            while(ii<str.length-1){
              set.push(`${randomnumber()}${str.substring(ii,ii+250)}`);
              ii+=250;
            };
            sendval("HOST_1",`1${writeint(res.width)}${randomnumber()}`);
          }).catch(()=>{
            sendval("HOST_1",`2${randomnumber()}`);
          });
        })
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

