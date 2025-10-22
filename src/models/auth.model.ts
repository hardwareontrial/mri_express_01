import { model, Schema, Types } from 'mongoose';
import { IAuthAbility, IAuthRole, UserAbilityRule } from './../types/auth.types';
import { Actions, Subjects } from './../types/auth.types'

const AbilitySchema = new Schema<UserAbilityRule>({
  action: { type: String, required: true },
  subject: { type: String, required: true }
},{
  _id: false,
  timestamps: false
})

export const AuthAbilitySchema = new Schema<IAuthAbility>({
  name: { type: String, required: true },
  ability: AbilitySchema,
  userIds: [{ type: Types.ObjectId, ref: 'User' }]
},{
  timestamps: false,
  collection: 'auth_abilities'
});
export const AuthAbilityModel = model<IAuthAbility>('Auth_Ability', AuthAbilitySchema);

export const AuthRoleSchema = new Schema<IAuthRole>({
  name: { type: String, required: true },
  abilities: [{ type: Types.ObjectId, ref: 'Auth_Ability' }],
  userIds: [{ type: Types.ObjectId, ref: 'User' }]
},{
  timestamps: false,
  collection: 'auth_roles'
});
export const AuthRoleModel = model<IAuthRole>('Auth_Role', AuthRoleSchema)