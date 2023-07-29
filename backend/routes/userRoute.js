import  express  from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const seceretKey = "InvetoryManagement"

const router = express.Router();

router.post("/register", async (req, res) => {
    let status = false;
    const { companyName, email, password } = req.body;

    try {
        if(!companyName || !email || !password){
            return res.status(400).json({msg: "Not all fields have been entered"})
        }

        if(password.length < 5){
            return res.status(400).json({msg: "Password needs to be atleast 5 characters long"})
        }

        const hashedPassword = await bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            companyName,
            email,
            password: hashedPassword
        })

        const data = {
            user: {
                companyName: newUser.companyName,
            }
        }

        const token = jwt.sign(data,seceretKey)
        status = true;
        res.status(200).json({"status": status ,"token":token ,msg: "User created successfully"})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

router.post("/login", async (req, res) => {
    let status = false;
    const { email, password } = req.body;

    try{
        if(!email || !password){
            return res.status(400).json({msg: "Not all fields have been entered"})
        }

        const existUser = await User.findOne({email: email})
        
        if(!existUser){
            return res.status(400).json({msg: "No account with this email has been registered"})
        }
        
        const isMAtch = await bcrypt.compareSync(password,existUser.password);
    
        if(!isMAtch){
            return res.status(400).json({msg: "Invalid credentials"})
        }

        const data = {
            user: {
                companyName: existUser.companyName
            }
        }
        const token = jwt.sign(data, seceretKey)
        status = true;
        res.status(200).json({"status": status ,"token":token ,msg: "User logged in successfully"})
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
})



export default router;