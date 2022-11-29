

const strings=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","_","-"];
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
  let rets=[];
  let i=0;
  while(i<str.length){
    const temp = parseInt(str.charAt(i)+str.charAt(i+1));
    if(temp=="00"){
        rets.push(ret);
        ret="";
    }else{
        const letter = strings[temp-11];
        ret=ret+letter;
    }
    i+=2;
    
  }
  return rets;
};

const writestr=(str)=>{
    let encoded="";
    for(let i=0;i<str.length;i++){
        encoded=encoded+(strings.indexOf(str.charAt(i))+11).toString();
    }
    encoded=encoded+"00";
    return encoded;
}
export {writeint,readint,writestr,readstr};