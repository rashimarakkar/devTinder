

const adminAuth = (req,res,next)=> {

    const token = "123";
    const isAdminAuthorized = token === "123"
   
    if(!isAdminAuthorized) res.status(401).send("Unauthorized")
    else next()


}

const userAuth = (req,res,next)=>{

    const token = "xyzs";
    const isAdminAuthorized = token === "xyz"
   
    if(!isAdminAuthorized) res.status(401).send("Unauthorized")
    else next()
    
}


module.exports ={
    adminAuth,
    userAuth
}