import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

interface CategoryAttributes {
  id: number | undefined;
  name: string | undefined;
}

class CategoryModel
  extends Model<CategoryAttributes>
  implements CategoryAttributes
{
  public id: number | undefined;
  public name: string | undefined;
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
  },
  {
    sequelize,
    modelName: "CategoryModel",
    tableName: "categories",
  }
);

export default CategoryModel;
