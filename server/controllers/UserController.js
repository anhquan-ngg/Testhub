import User from '../models/UserModel.js';

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const addUser = async (req, res, next) => {
    try {
        const {full_name, email, password, role} = req.body;
        const user = await User.create({email, password, full_name, role});
        return res.status(201).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const patchUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {full_name, email, password, role} = req.body;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({message: "User không tồn tại"});
        }
        await user.update({full_name, email, password, role});
        return res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({message: "User không tồn tại"});
        }
        await user.destroy();
        return res.status(200).json({message: "Xóa thành công"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server bị lỗi"});
    }
}
