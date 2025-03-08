import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";

class Medicine extends Model {
  public id!: number;
  public name!: string;
  public dosage!: string;
  public quantity!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Medicine.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  },
  {
    sequelize,
    tableName: "medicines",
  }
);

export default Medicine;
