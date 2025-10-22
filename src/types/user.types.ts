import { Document, Types } from 'mongoose';
import { IAuthAbilityWrapper, IAuthRoleWrapper, UserAbilityRule } from './auth.types';

export const SALT_ROUNDS = 12

export interface IUser extends Document {
  nik: number
  shortNik: string
  firstName: string
  lastName: string
  email: string
  password: string
  verifiedAt?: string
  roleId: Types.ObjectId
  userAbilities: Types.ObjectId[]
  avatar?: string
  isAdmin: boolean
  isActive: boolean
}

export interface IUserWrapper {
  id: string|number
  nik: number
  shortNik: string
  firstName: string
  lastName: string
  email: string
  password: string
  verifiedAt?: string
  roleId: IAuthRoleWrapper
  userAbilities: IAuthAbilityWrapper[]
  avatar?: string
  isAdmin: boolean
  isActive: boolean
}

export interface UserWrapper {
  id: number | string
  fullName?: string
  username: string
  password: string
  avatar?: string
  email: string
  role: string
  abilityRules: UserAbilityRule[]
}