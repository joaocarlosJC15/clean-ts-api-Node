import request from 'supertest'
import app from '../config/app'

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/test_body_parser', (request, response) => {
      console.log(request.body)
      response.send(request.body)
    })

    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Joao' })
      .expect({ name: 'Joao' })
  })
})
