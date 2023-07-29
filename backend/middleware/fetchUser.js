import jwt from 'jsonwebtoken'

const seceretKey = "InvetoryManagement"

const fetchUser = (req,res,next) =>{
    const token = req.header('auth-token')

    if(!token){
        res.status(401).json({error: "Please authenticate using a valid token"})
    }

    try {
        const data = jwt.verify(token,seceretKey)
        req.user = data.user
        next()
    }
    catch (error) {
        res.status(401).json({error: "Please authenticate using a valid token"})
    }
}

export default fetchUser;