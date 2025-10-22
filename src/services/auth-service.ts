import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthAbilityModel, AuthRoleModel } from '../models/auth.model';
import { UserModel } from '../models/user.model';
import { LoginResponse, SECRET_KEY, UserOut, IAuthAbility, IAuthAbilityWrapper, UserAbilityRule, IAuthRoleWrapper } from '../types/auth.types';
import { IUser, IUserWrapper, UserWrapper } from '../types/user.types';

export class AuthService {
  private mergeAbilities(data: IUser): UserAbilityRule[] {
    const seenIds = new Set<string>();
    const abilityRules: UserAbilityRule[] = [];
    const roles: string[] = [];

    const populated = data as IUser & { roleId: IAuthRoleWrapper,  userAbilities: IAuthAbilityWrapper }
    if(populated && populated.roleId) {
      for(const ability of populated.roleId.abilities) {
        if(!seenIds.has(ability._id)) {
        abilityRules.push({ action: ability.ability.action, subject: ability.ability.subject })
        }
      }
    }

    if(populated && populated.userAbilities.length > 0) {
      for(const ability of populated.userAbilities as any[]) {
        if(!seenIds.has(ability._id)) {
          abilityRules.push({ action: ability.ability.action, subject: ability.ability.subject })
        }
      }
    }

    return abilityRules;
  }

  public async findAllAbilityRules() {
    return await AuthAbilityModel
      .find()
      .populate('userIds')
      .lean();
  }

  public async findAllRoles() {
    return await AuthRoleModel
      .find()
      .populate('abilities')
      .populate('userIds')
      .lean();
  }

  public async login(username: string, password: string) {
    try {
      let accessToken: string = '';
      let isUser: IUser|null = null;
      
      if(isNaN(parseInt(username))) {
        if(!isUser) {
          isUser = await UserModel.findOne().where({ email: username }).populate(
            {
              path: 'roleId',
              populate: {
                path: 'abilities' 
              }
            })
          .populate('userAbilities')
          .lean();
        }
  
        if(!isUser) {}
      } else {}
      
      if(!isUser) { throw new Error('Username tidak ditemukan') }
      if(isUser && !isUser.isActive) { throw new Error('Username tidak aktif') }

      if(isUser) {
        const populated = isUser as IUser & { roleId: IAuthRoleWrapper,  userAbilities: IAuthAbilityWrapper }
        
        const comparedPassword = bcrypt.compareSync(password, populated?.password);
        if(!comparedPassword) { throw new Error('Password tidak sesuai') }
        
        const mergedAbilities = this.mergeAbilities(populated);
        accessToken = jwt.sign({ username: username, password: password }, SECRET_KEY, { algorithm: 'HS256' });
        
        const userWrapper: UserWrapper = {
          id: populated.nik,
          fullName: (`${populated.firstName} ${populated.lastName}`).trim(),
          username: username,
          password: password,
          avatar: populated.avatar,
          email: populated.email,
          role: populated.roleId.name,
          abilityRules: mergedAbilities
        }

        const userOutData = Object.fromEntries(
          Object.entries(userWrapper)
            .filter(
              ([key, _]) => !(key === 'password' || key === 'abilityRules'),
            ),
        ) as UserOut['userData']

        const response: UserOut = {
          userAbilityRules: userWrapper.abilityRules,
          accessToken,
          userData: userOutData
        }
  
        return response
      }
    } catch (error) {
      throw error;
    }
  }
}