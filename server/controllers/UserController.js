import User from "../models/UserModel.js";
import { Op } from "sequelize";

export const getAllUsers = async (req, res, next) => {
  try {
    // Lấy query parameters với giá trị mặc định
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const searchTerm = req.query.search;
    const role = req.query.role;

    const offset = (page - 1) * limit;
    const whereCondition = {};

    if (searchTerm) {
      whereCondition[Op.or] = [
        { full_name: { [Op.iLike]: `%${searchTerm}%` } },
        { email: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    if (role) {
      if (role != "all") whereCondition.role = role;
    }

    // Lấy users với pagination
    let users;
    if (searchTerm || role) {
      users = await User.findAndCountAll({
        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
        where: whereCondition,
      });
    } else {
      users = await User.findAndCountAll({
        offset: offset,
        limit: limit,
        order: [["createdAt", "DESC"]],
      });
    }

    const totalUsers = users.count;
    const totalPages = Math.ceil(totalUsers / limit);

    // Trả về response với thông tin pagination
    return res.status(200).json({
      users: users.rows,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalUsers: totalUsers,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server bị lỗi" });
  }
};

export const getRecentUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
      limit: 3,
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const { full_name, email, password, role } = req.body;
    const user = await User.create({ email, password, full_name, role });
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server bị lỗi" });
  }
};

export const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, email, password, role } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    await user.update({ full_name, email, password, role });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server bị lỗi" });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    await user.destroy();
    return res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server bị lỗi" });
  }
};
