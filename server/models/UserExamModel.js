import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const UserExam = sequelize.define('UserExam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  exam_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Exams',
      key: 'id'
    }
  },
  registered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  total_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: null
  },
  status: {
    type: DataTypes.ENUM('registered', 'completed'),
    defaultValue: 'registered'
  }
}, {
  tableName: 'user_exams',
  timestamps: true
});

export default UserExam;