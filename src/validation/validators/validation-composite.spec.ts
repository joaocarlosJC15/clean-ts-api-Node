import { ValidationComposite } from './validation-composite'
import { MissingParamError } from '@/presentation/errors'
import { Validation } from '@/presentation/protocols'

type SutTypes = {
  sut: ValidationComposite
  validationStubs: Validation[]
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]
  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[1], 'validate').mockReturnValue(new MissingParamError('field'))
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()
    jest.spyOn(validationStubs[0], 'validate').mockReturnValue(new Error())
    jest.spyOn(validationStubs[1], 'validate').mockReturnValue(new MissingParamError('field'))
    const error = sut.validate({ field: 'any' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'any' })
    expect(error).toBeFalsy()
  })
})
