import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(userInfo: User): Promise<User> {
    // 加密password-sha256
    const password = crypto.createHash('sha256').update(userInfo.password).digest('hex');
    const createdUser = new this.userModel({ ...userInfo, password });
    // 如果用户名存在
    const user = await this.userModel.findOne({ username: createdUser.username }).exec();
    if (user) {
      throw new BadRequestException('用户名已存在');
    }
    return createdUser.save();
  }

  async findAllUsersList(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findUserById(id: string, select?: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .select(select || '-password')
      .exec();
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}
