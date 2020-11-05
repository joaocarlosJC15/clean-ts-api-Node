export interface Authentication {
  auth (authenticationParams: AuthenticationParams): Promise<string>
}

export type AuthenticationParams = {
  email: string
  password: string
}
