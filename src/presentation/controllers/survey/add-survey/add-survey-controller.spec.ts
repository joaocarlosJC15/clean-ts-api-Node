import { HttpRequest, Validation } from './add-survey-protocols'
import { AddSurveyController } from './add-survey-controller'

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }

  return new ValidationStub()
}

describe('AddSurvey Controller', () => {
  test('Should call Validation with correct values', async () => {
    const validationStub = makeValidationStub()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()
    const sut = new AddSurveyController(validationStub)

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
