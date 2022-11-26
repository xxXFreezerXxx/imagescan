//import
import Jimp from 'jimp';
import fs from "fs";
import scloudjs from "scloudjs";
import https from "https";
import dotenv from "dotenv";
import sharp from 'sharp';
const secret =dotenv.config().parsed;
const reqres = [[20,20],[20,15],[20,15]];
const strings=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","_","-"];
let reqtype;
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
          await image.resize(reqres[reqtype-1][0], reqres[reqtype-1][1]);
          let datas =[];
          for(let i=0;i<reqres[reqtype-1][0]*reqres[reqtype-1][1];i++){
            const colour =Jimp.intToRGBA(image.getPixelColor(i%20,Math.floor(i/20)));
            datas.push((colour.r*65536+colour.g*256+colour.b).toString());
          }
          let str="";
          for(let i=0;i<datas.length;i++){
            str=str+writeint(datas[i]);
          };
          
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

const writeint=(num)=>{
  const temp = num;
  return `${temp.length.toString().length}${temp.length}${temp}`;
}
const readint=(str)=>{
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
const readstr=(str)=>{
  let ret="";
  let i=0;
  while(i<str.length-1){
    const temp = str.charAt(i)+str.charAt(i+1);
    const letter = strings[parseInt(temp)-11];
    ret=ret+letter;
    i+=2;
  }
  return ret;
};
{
let set=[];
let i;
const sender =()=>{
  let eight=[];
  for(let ii=0;ii<8;ii++){
    if(ii+i<set.length){
      eight.push(set[ii+i]);
    }else{
      eight.push("0");
    }
  }
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
      console.log(clouddatas.CLIENT.value);
      const client = clouddatas.CLIENT.value;
      if(client.charAt(0)!=4){
        reqtype=client.charAt(0);
      }
      if(client.charAt(0)==0){
        sendval("HOST_1",Math.floor(Math.random()*100000).toString());
      }else if(client.charAt(0)==1||client.charAt(0)==2||client.charAt(0)==3){
        set=[];
        let name = client.substring(1);
        name=readstr(name);
        const readylink = new Promise((resolve,reject)=>{
          if(reqtype==1){
            getimg(`https://api.scratch.mit.edu/users/${name}/`).then(res=>{
              const result = JSON.parse(Buffer.from(res,"utf-8").toString()).id;
              resolve(`https://uploads.scratch.mit.edu/get_image/user/${result}_60x60.png`);
            }).catch(()=>{
              reject();
            });
            
          } else if(reqtype==2){
            resolve(`https://uploads.scratch.mit.edu/get_image/project/${name}_144x108.png`);
          } else if(reqtype==3){
            resolve(`https://uploads.scratch.mit.edu/get_image/gallery/${name}_144x108.png`);
          }
      }).then(res=>{
          getimgcolour(res).then(res=>{
            let str="";
            for(let i=0;i<res.length;i++){
              str=str+writeint(res[i]);
            };
            i=0;
            while(i<str.length){
              set.push(/*(i/256+1).toString()*/str.substring(i,i+256));
              i+=256;
            }
            i=0;
            const s = `${writeint(set.length.toString())}${writeint(Math.floor(Math.random()*100000).toString())}`;
            sendval("HOST_1",s);
  
          }).catch(()=>{
            let str=`2${Math.floor(Math.random()*100000).toString()}`;
            sendval("HOST_1",str);
          })

        }).catch(()=>{
          let str=`2${Math.floor(Math.random()*100000).toString()}`;
          sendval("HOST_1",str);
        });
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

