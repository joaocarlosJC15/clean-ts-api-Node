import { LogControllerDecorator } from './log'
import { HttpRequest, Controller, HttpResponse } from '../../presentation/protocols'
import { serverError } from '../../presentation/helpers/http-helper'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
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

  return new ControllerStub()
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }

  return new LogErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController()
  const logErrorRepositoryStub = makeLogErrorRepository()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut()

    const handleSpy = jest.spyOn(controllerStub, 'handle')

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

  test('Should return the smae result of the controller', async () => {
    const { sut } = makeSut()

    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        name: 'name',
        email: 'email@email.com',
        password: '1234',
        passwordConfirmation: '1234'
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()

    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log')

    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)))

    const httpRequest: HttpRequest = {
      body: {
        email: 'email@email.com',
        name: 'name',
        password: '1234',
        passwordConfirmation: '1234'
      }
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
