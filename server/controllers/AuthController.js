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

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: "Email đã được sử dụng" }); 
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
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({message: "Email và mật khẩu không được để trống"});
        }

        const user = await User.findOne({where: {email}});
        if(!user){
            return res.status(404).json({message: "Email không tồn tại"});
        }
        const auth = await compare(password, user.password);
        if(!auth){
            return res.status(400).json({message: "Mật khẩu không chính xác"});
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
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        const user = await User.findOne({id: req.userId});
        if (!user) return res.status(404).json({message: "Không tìm thấy người dùng"});
        return res.status(200).json({
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const updateUserInfo = async (req, res, next) => {
    try {
        const user = await User.findOne({id: req.userId});
        if (!user) return res.status(404).json({message: "Không tìm thấy người dùng"});
        const {full_name, phone, school, address} = req.body;
        await user.update({full_name, phone, school, address});
        return res.status(200).json({
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt","", {maxAge:1, secure:true, sameSite:"None"})

        return res.status(200).send("Logout successfully");
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Server bị lỗi"});
    }
}