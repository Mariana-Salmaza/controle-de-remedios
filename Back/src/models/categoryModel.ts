import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import UserModel from "./UserModel";

interface CategoryAttributes {
  id?: number;
  name: string;
  userId: number;
}

class CategoryModel
  extends Model<CategoryAttributes>
  implements CategoryAttributes
{
  public id!: number;
  public name!: string;
  public userId!: number;
}

CategoryModel.init(
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
    modelName: "CategoryModel",
    tableName: "categories",
  }
);

CategoryModel.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});

export default CategoryModel;
