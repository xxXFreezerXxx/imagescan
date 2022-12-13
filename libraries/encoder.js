const strings=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","_","-"];
const writeint=(num)=>{
    const temp = num;
    return `${temp.length.toString().length}${temp.length}${temp}`;
}
let amount=8;
const amountofhostvalues = (am)=>{
  amount=am;
}
const readint=(str,i)=>{
  const digitofdigit = parseInt(str.charAt(i));
  const digit=parseInt(str.substring(i+1,digitofdigit+i+1));
  const data = str.substring(i+1+digitofdigit,i+1+digitofdigit+digit);
  i+=1+digitofdigit+digit;
  return {data:data,i:i};
}
const readstr=(str,i)=>{
  let ret="";
  while(i<str.length){
    const temp = parseInt(str.charAt(i)+str.charAt(i+1));
    if(temp=="00"){
      break;
    }else{
        const letter = strings[temp-11];
        ret=ret+letter;
    }
    i+=2;
    
  }
  return {data:ret,i:i};
};

const writestr=(str)=>{
    let encoded="";
    for(let i=0;i<str.length;i++){
        encoded=encoded+(strings.indexOf(str.charAt(i))+11).toString();
    }
    encoded=encoded+"00";
    return encoded;
};

const createlist = (str,name)=>{
  const arrlength = Math.ceil(str.length/250);
  let fileinfo;
  if(name==undefined){
    fileinfo=randomnumber()+"1"+writeint(arrlength.toString())+"00";
  }else{
    fileinfo=randomnumber()+"1"+writeint(arrlength.toString())+writestr(name);
  }
  let ii=-250*amount;
  let retlist = Array.from(new Array(Math.ceil(arrlength/amount)+1),() => {
    let onelist =[];
    if(ii==-250*amount){
      onelist.push(fileinfo);
      for(let i=0;i<amount-1;i++){
        onelist.push(null);
      }
    }else{
    for(let i=0;i<amount;i++){
      const subst = str.substring(ii+i*250,ii+(i+1)*250);
      if(subst != ""){
        onelist.push(randomnumber()+subst);
      }else {
        onelist.push(null);
      }
    }

    }
    ii+=250*amount;
    
    return onelist;
  });
  return retlist;
};
const randomnumber = ()=>{
  return (Math.floor(Math.random()*900000)+100000).toString();
};
export {writeint,readint,writestr,readstr,createlist,randomnumber,amountofhostvalues};

/*
import * as image from "./imageparser.js";
image.getimagedata("https://avatars.githubusercontent.com/u/97340998?s=48&v=4").then(res=>{
  let st="";
  for(let i=0;i<res.datas.length;i++){
    st +=writeint(res.datas[i]);
  }
  console.log(createlist(st));
})*/