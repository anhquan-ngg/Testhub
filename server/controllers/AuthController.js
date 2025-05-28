import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import {compare} from 'bcrypt';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge});
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

        const token = createToken(email, user.id);
        
        // Fix cookie configuration
        const cookieOptions = {
            maxAge,
            httpOnly: true, // Bảo mật hơn
            secure: process.env.NODE_ENV === 'production', // chỉ HTTPS trong production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // lax cho development
        };
        
        res.cookie("jwt", token, cookieOptions);
        
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
        const token = createToken(email, user.id);
        
        // Fix cookie configuration
        const cookieOptions = {
            maxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };
        
        res.cookie("jwt", token, cookieOptions);
        
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

export const logout = async (req, res, next) => {
    try {
        // Clear cookie properly
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        };
        
        res.clearCookie("jwt", cookieOptions);
        return res.status(200).json({message: "Logout successfully"});
    } catch (error) {
        console.log({error});
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        // Fix: sử dụng findByPk thay vì findOne với object
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({message: "Không tìm thấy người dùng"});
        }
        
        return res.status(200).json({
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
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
