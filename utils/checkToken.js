import jwt from "jsonwebtoken";

export const tokenPassword = ()=>{
    return "vfvjdfvbjfdbvffgbfubfugbfug"
}

// check can convert to data Obj 
// check expired 
export const checkToken = async (token) => {
    try{
        let user = await jwt.verify(token, tokenPassword() )
        if(new Date(user.timeExpried) > new Date()){
            return {
                userId:user.id,
                status:true
            }
        }
        else{
            return {
                userId:"",
                status:false
            }
        }

    }
    catch(e){
        console.log(e);
        return {
            userId:"",
            status:false
        }
    }
  };