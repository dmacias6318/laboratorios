const moment=require('moment');
const helpers={}

helpers.timeAgo=timestamp=>{
   return moment(timestamp).startOf('minute').fromNow();

}

helpers.estadoPropietario=(estado)=>{
    if(estado==1){
        return true
    }else{
        return false
    }
}
helpers.estadoActividad=(estado)=>{
    if(estado==1){
        return true
    }else{
        return false
    }
}
module.exports = helpers;