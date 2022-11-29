import Jimp from "jimp";
import fs, { writeFile } from "fs";
import sharp from "sharp";
import request from "./request.js";
import * as encoder from "./encoder.js";
const getimagedata = (link)=>{
  return new Promise((resolve,reject)=>{
    request(link).then(res=>{
      fs.writeFile('img/img.png', res, async function (err) {
        if (err) throw err;
        const a =sharp("./img/img.png").png({ mozjpeg: true }).toFile("./img/convert.png")
        .then(async res=>{
        
          const image = await Jimp.read(`./img/convert.png`);
          const width = (20/image.bitmap.height)*image.bitmap.width;
          await image.resize(20,width);
          let datas =[];
          for(let i=0;i<400;i++){
            const colour =Jimp.intToRGBA(image.getPixelColor(i%20,Math.floor(i/20)));
            datas.push((colour.r*65536+colour.g*256+colour.b).toString());
          }
          let str="";
          for(let i=0;i<datas.length;i++){
            str=str+encoder.writeint(datas[i]);
          };
          
          resolve({datas:datas,width:width});

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
export {getimagedata};