import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import CategoryModel from "./categoryModel";
import UserModel from "./UserModel";

interface MedicineAttributes {
  id: number | undefined;
  name: string | undefined;
  dosage: string | undefined;
  quantity: number | undefined;
  schedules: string | undefined;
  categoryId: number | undefined;
  userId: number | undefined;
}

class MedicineModel
  extends Model<MedicineAttributes>
  implements MedicineAttributes
{
  public id: number | undefined;
  public name: string | undefined;
  public dosage: string | undefined;
  public quantity: number | undefined;
  public schedules: string | undefined;
  public categoryId: number | undefined;
  public userId: number | undefined;
}

MedicineModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    schedules: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "MedicineModel",
    tableName: "medicines",
  }
);

// Relacionamentos
MedicineModel.belongsTo(CategoryModel, {
  foreignKey: "categoryId",
  as: "category",
});
CategoryModel.hasMany(MedicineModel, {
  foreignKey: "categoryId",
  as: "medicines",
});

// Relacionamento com o usuário
MedicineModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});
UserModel.hasMany(MedicineModel, {
  foreignKey: "userId",
  as: "medicines",
});

export default MedicineModel;
