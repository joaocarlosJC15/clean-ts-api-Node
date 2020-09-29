import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  },

  async verify (): Promise<string> {
    return await Promise.resolve('any_value')
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Shold call sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      await sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Shold return a token on a sign sucess', async () => {
      const sut = makeSut()
      const acessToken = await sut.encrypt('any_id')
      expect(acessToken).toBe('any_token')
    })

    test('Shold throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Shold call verify with correct values', async () => {
      const sut = makeSut()

      const signSpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(signSpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Shold return a value on verify sucess', async () => {
      const sut = makeSut()

      const acessToken = await sut.decrypt('any_value')

      expect(acessToken).toBe('any_value')
    })

    test('Shold throw if sign throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.decrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })
})
