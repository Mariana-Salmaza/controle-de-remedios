import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

// Define os atributos do MedicineModel
interface MedicineAttributes {
  id: number | undefined;
  name: string | undefined;
  dosage: string | undefined;
  quantity: number | undefined;
  schedules: string | undefined;
}

// Define a classe MedicineModel
class MedicineModel
  extends Model<MedicineAttributes>
  implements MedicineAttributes
{
  public id: number | undefined;
  public name: string | undefined;
  public dosage: string | undefined;
  public quantity: number | undefined;
  public schedules: string | undefined;
}

// Inicialização do modelo
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
  },
  {
    sequelize,
    modelName: "MedicineModel",
    tableName: "medicines",
  }
);

export default MedicineModel;
