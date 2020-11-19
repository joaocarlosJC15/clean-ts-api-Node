import { AuthenticationModel } from '@/domain/models/authentication'
export interface Authentication {
  auth (authenticationParams: AuthenticationParams): Promise<AuthenticationModel>
}

export type AuthenticationParams = {
  email: string
  password: string
}
