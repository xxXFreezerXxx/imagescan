

const strings=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","_","-"];
const writeint=(num)=>{
    const temp = num;
    return `${temp.length.toString().length}${temp.length}${temp}`;
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
  let i=0;
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
}

const createlist = (str,name)=>{
  const arrlength = str.length/250;
  let retlist = [];
  let fileinfo;
  if(name==undefined){
    fileinfo=randomnumber()+writeint(arrlength)+"00";
  }else{
    fileinfo=randomnumber()+writeint(arrlength)+writestr(name);
  }
  retlist.push([fileinfo,null,null,null,null,null,null,null]);
  for(let i=0;i<arrlength;i++){
    retlist.push([]);
    const subst = str.substring(i*250,(i+1)*250);
    if(subst == ""){
      retlist[i].push(randomnumber()+subst);
    }else {
      retlist[i].push(null);
    }
  }
  return retlist;
};
const randomnumber = ()=>{
  return (Math.floor(Math.random()*900000)+100000).toString();
}
export {writeint,readint,writestr,readstr,createlist,randomnumber};