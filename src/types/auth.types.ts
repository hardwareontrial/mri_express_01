import { Request, Response, NextFunction } from 'express';
import { Document, model, Schema, Types } from 'mongoose';
import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { UserWrapper, IUserWrapper } from './user.types'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type Subjects = 'Auth' | 'Admin' | 'AclDemo' | 'all' | 'TimbanganKompos' | 'TimbanganKomposMaster';

export const SECRET_KEY: Secret = process.env.JWT_SECRET_KEY || 'MOLINDO';

export interface UserAbilityRule {
  action: Actions
  subject: Subjects
}

export interface IAuthAbility extends Document {
  name: string
  ability: UserAbilityRule
  userIds: Types.ObjectId[]
}

export interface IAuthAbilityWrapper {
  _id: string
  name: string
  ability: UserAbilityRule
  userIds: IUserWrapper[]
}

export interface IAuthRole extends Document {
  name: string
  abilities: Types.ObjectId[]
  userIds: Types.ObjectId[]
}

export interface IAuthRoleWrapper {
  _id: string
  name: string
  abilities: IAuthAbilityWrapper[]
  userIds: IUserWrapper[]
}

export interface UserOut {
  userAbilityRules: UserWrapper['abilityRules']
  accessToken: string
  userData: Omit<UserWrapper, 'abilities' | 'password'>
}

export interface LoginResponse {
  accessToken: string
  userData: UserWrapper
  userAbilityRules: UserWrapper['abilityRules']
}

export interface RegisterResponse {
  accessToken: string
  userData: UserWrapper
  userAbilityRules: UserWrapper['abilityRules']
}

export interface CustomRequest extends Request {
  token: string | JwtPayload
}