import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import { genSalt, hash } from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'teacher'),
    defaultValue: 'student',
    allowNull: false,
  },
}, {
  tableName: 'users', // Tên bảng trong PostgreSQL
  timestamps: true,
});

User.beforeCreate(async (User, options) => {
  const salt = await genSalt(10);
  User.password = await hash(User.password, salt);
});

export default User;
