import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import {compare} from 'bcrypt';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge});
}

export const signup = async (req, res, next) => {
    try {
        const {full_name, email, phone, password} = req.body;
        if (!email || !password || !full_name){
            return res.status(400).send("Fullname, email, and password are required");
    
        }

        const user = await User.create({full_name, email, phone, password});
        
        res.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none",
        })
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                phone: user.phone,
                role: user.role,
            }
        });
    } catch (error) {
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).send("Email and password are required");
        }

        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(404).send("User not found with given email");
        }
        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(400).send("Password is incorrect");
        }

        res.cookie("jwt", createToken(user.email, user.id), {
            maxAge,
            secure: true,
            sameSite: "none",
        });

        return res.json({
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error){
        console.log({error});
        return res.status(500).send("Internal Server Error");
    }
}