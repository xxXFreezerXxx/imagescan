//import
import Jimp from 'jimp';
import fs from "fs";
import scloudjs from "scloudjs";
import https from "https";

//functions to get image
const getimg = (link)=>{
    return new Promise((resolve,reject)=>{
        const req = https.get(link,res=>{
            let datas = [];
            res.on('data', (a) => {
                datas.push(a);
            });
            res.on("end",()=>{
                if(res.statusCode==200){
                    const data = Buffer.concat(datas);
                    resolve(data);
                }else{
                  reject(res.statusCode);
                }
            })
        })
        req.on("error",(error)=>{reject(error.message)});
        
    })
}

const getimgcolour = (link)=>{
  return new Promise((resolve,reject)=>{
    getimg(link).then(res=>{
      fs.writeFile('img.png', res, async function (err) {
        if (err) throw err;
        const image = await Jimp.read(`./img.png`);
        await image.resize(20, Jimp.AUTO);
        let datas =[];
        for(let i=0;i<400;i++){
          datas.push(image.getPixelColor(i%20,Math.floor(i/20)));
        }
        resolve(datas);
      });
      
    })
    .catch(res=>{
      reject();
    });
  })
};

//tools to controll cloud variables
let clouddatas = new Object();
let time=0;
let ran=0;
const hostvals = ["HOST_1","HOST_2","HOST_3","HOST_4","HOST_4","HOST_5","HOST_6","HOST_7","HOST_8","HOST_9"];
const configvals = (vals)=>{
  for(let i=0;i<9;i++){
    if(vals[i]!=null){
      sendval(hostvals[i],vals[i]);
    }
  }
}
const sendval = (name,value)=>{
  scloudjs.sendtocloud(name,value);
  clouddatas[name].value =value;
  
}

const writestr=(num)=>{
  const temp = num.toString();
  return `${temp.length.toString().length}${temp.length}${temp}`;
}
const readstr=(str)=>{
  
}


//controll cloud variables
const process = (data)=>{
   const temp = scloudjs.parsedata(data,clouddatas);
   clouddatas = temp.clouddatas;
   const changedlists = temp.changedlists;
   console.log(changedlists);
   if(time==0){
    time=1;
   }else{
    if(changedlists.indexOf("CLIENT")!=-1){
      const client = clouddatas.CLIENT.value;
      if(client.charAt(0)==0){
        ran=(ran+1)%10;
        sendval("HOST_1",ran);
      }else if(client.charAt(0)==1){
        getimgcolour("https://uploads.scratch.mit.edu/get_image/user/83921919_60x60.png").then()
      }
    }
   }

};

scloudjs.setdatas("xX_Freezer_Xx","","763589970",process);

const func = async()=>{

    await scloudjs.login();
    console.log("Logged in to scratch account");
    await scloudjs.connect();
    console.log("Connected to server");
    await scloudjs.handshake();
};
func();
