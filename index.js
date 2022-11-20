//import
import Jimp from 'jimp';
import fs from "fs";
import scloudjs from "scloudjs";
import https from "https";
import dotenv from "dotenv";
import sharp from 'sharp';
const secret =dotenv.config().parsed;
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
      fs.writeFile('img/img.png', res, async function (err) {
        if (err) throw err;
        const a =sharp("./img/img.png").png({ mozjpeg: true }).toFile("./img/convert.png")
        .then(async res=>{
        
          const image = await Jimp.read(`./img/convert.png`);
          await image.resize(20, 20);
          let datas =[];
          for(let i=0;i<400;i++){
            const colour =Jimp.intToRGBA(image.getPixelColor(i%20,Math.floor(i/20))); 
            datas.push((colour.r*65536+colour.g*256+colour.b).toString());
          }
          
          resolve(datas);

        })
        .catch(res=>console.log(res));
        sharp.cache({ files : 0 });
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
const hostvals = ["HOST_1","HOST_2","HOST_3","HOST_4","HOST_5","HOST_6","HOST_7","HOST_8"];
const configvals = (vals)=>{
  for(let i=0;i<8;i++){
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
  const temp = num;
  return `${temp.length.toString().length}${temp.length}${temp}`;
}
const readstr=(str)=>{
  let i=0;
  let datas=[];
  while(i<str.length){
      const digitofdigit = parseInt(str.charAt(i));
      const digit=parseInt(str.substring(i+1,digitofdigit+i+1));
      datas.push(str.substring(i+1+digitofdigit,i+1+digitofdigit+digit));
      i+=1+digitofdigit+digit;
  }
return datas;
}
{
let set=[];
let i;
const sender =()=>{
  let eight=[];
  for(let ii=0;ii<9;ii++){
    if(ii+i<set.length){
      eight.push(set[ii+i]);
    }else{
      eight.push("0");
    }
  }
  setInterval(() => {
    configvals(eight);
    i+=8;
    
  }, 200);

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
      console.log(clouddatas.CLIENT.value);
      const client = clouddatas.CLIENT.value;
      if(client.charAt(0)==0){
        ran=(ran+1)%10;
        sendval("HOST_1",ran.toString());
      }else if(client.charAt(0)==1){
        set=[];
        const id = client.substring(1);
        getimgcolour(`https://uploads.scratch.mit.edu/get_image/user/${id}_60x60.png`).then(res=>{
          let str="";
          for(let i=0;i<res.length;i++){
            str=str+writestr(res[i]);
          };
          i=0;
          while(i<str.length){
            set.push(str.substring(i,i+256));
            i+=256;
          }
          console.log(set.length);
          i=0;
          const s = `${writestr(set.length.toString())}${writestr(Math.floor(Math.random()*100000).toString())}`;
          sendval("HOST_1",s);

        })
      }else if(client.charAt(0)=="4"){
        sender();
        if(i>set.length){
          set=[];
        }
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
