import { LogControllerDecorator } from './log'
import { HttpRequest, Controller, HttpResponse } from '../../presentation/protocols'

describe('LogController Decorator', () => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: 'name',
          email: 'email@email.com',
          password: '1234',
          passwordConfirmation: '1234'
        }
      }

      return await new Promise(resolve => resolve(httpResponse))
    }
  }
  test('Should call controller handle', async () => {
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)

    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
