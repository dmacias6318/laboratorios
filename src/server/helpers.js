const moment=require('moment');
const bcrypt=require('bcryptjs');

const helpers={}

helpers.timeAgo=timestamp=>{
   return moment(timestamp).startOf('minute').fromNow();

}

helpers.encryptPassword=async(password)=>{
   const salt= await bcrypt.genSalt(10);
   const hash=await bcrypt.hash(password,salt)
   return hash;
}

helpers.matchPassword=async(password,savepassword)=>{
    try {
        //listing messages in users mailbox 
        return await bcrypt.compare(password,savepassword)
        } catch (err) {
            return false;
        }
        
   
}

helpers.randomNumber=()=>{
   const possible='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*-.@';
   let randonNumber=0;
   for(let i=1 ; i<8;i++){
       randonNumber += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return randonNumber;
}


helpers.randomCode=()=>{
    const possible='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*-.';
    let randonNumber=0;
    for(let i=1 ; i<5;i++){
        randonNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randonNumber;
 }


helpers.randomNumberSucursal=()=>{
    const possible='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*-.';
    let randonNumber=0;
    for(let i=1 ; i<2;i++){
        randonNumber += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return randonNumber;
 }


helpers.randomImageName=()=>{
   const possible='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   let randonNumber=0;
   for(let i=0 ; i<6;i++){
       randonNumber += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return randonNumber;
}


helpers.db=()=>{
    const possible='abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   let randonNumber=0;
   for(let i=0 ; i<6;i++){
       randonNumber += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return randonNumber;
 }

module.exports=helpers;