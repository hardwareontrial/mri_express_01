import { UserModel } from '../models/user.model';

export class UserServices {
  public async findAllUsers() {
    return await UserModel.find().lean();
  }

  public async getUserById(id: string) {
    return await UserModel.findById(id);
  }
}