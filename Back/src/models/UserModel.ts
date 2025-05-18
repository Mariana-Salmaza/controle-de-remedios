import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import bcrypt from "bcrypt";

// Define os atributos do UserModel
interface UserAttributes {
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  document: string | undefined;
  password: string | undefined;
}

// Define a classe UserModel
class UserModel extends Model<UserAttributes> implements UserAttributes {
  public id: number | undefined;
  public name: string | undefined;
  public email: string | undefined;
  public document: string | undefined;
  public password: string | undefined;

  // Método para criptografar a senha
  public async hashPassword() {
    this.password = await bcrypt.hash(this.password!, 10);
  }

  // Método para validar a senha
  public async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password!);
  }
}

// Inicialização do modelo
UserModel.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserModel",
    tableName: "users",
  }
);

// Ganchos (Hooks) para criptografar a senha antes de criar ou atualizar o usuário
UserModel.beforeCreate(async (user: UserModel) => {
  await user.hashPassword();
});

UserModel.beforeUpdate(async (user: UserModel) => {
  if (user.changed("password")) {
    await user.hashPassword();
  }
});

export default UserModel;
