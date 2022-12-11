

const strings=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","_","-"];
const writeint=(num)=>{
    const temp = num;
    console.log(temp);
    return `${temp.length.toString().length}${temp.length}${temp}`;
}
let amount;
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
}

const createlist = (str,name)=>{
  const arrlength = Math.ceil(str.length/250);
  let matarray = [];
  for(let i=0;i<amount;i++){
    matarray.push(null);
  }
  let retlist = Array(Math.ceil(arrlength/amount)+1).fill(matarray);
  //このarrayは一つを変えると全てが変わるからArrayクラスに依存しない形のものに書き直す必要がある。
  let fileinfo;
  if(name==undefined){
    fileinfo=randomnumber()+"1"+writeint(arrlength.toString())+"00";
  }else{
    fileinfo=randomnumber()+"1"+writeint(arrlength.toString())+writestr(name);
  }
  retlist[0][0]=fileinfo;
  for(let i=0;i<Math.ceil(arrlength);i++){
    const subst = str.substring(i*250,(i+1)*250);
    if(subst != ""){
      retlist[Math.floor(i/amount)+1][i%amount]=randomnumber()+subst;
    }else {
      retlist[Math.floor(i/amount)+1][i%amount]=null;
    }
  }
  return retlist;
};
const randomnumber = ()=>{
  return (Math.floor(Math.random()*900000)+100000).toString();
}
amountofhostvalues(8);
console.log(createlist("19123456789"));
export {writeint,readint,writestr,readstr,createlist,randomnumber,amountofhostvalues};