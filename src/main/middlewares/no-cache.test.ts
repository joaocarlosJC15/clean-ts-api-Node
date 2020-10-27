import request from 'supertest'
import app from '../config/app'
import { noCache } from './no-cache'

describe('NoCache Middleware', () => {
  test('Should enable CORS', async () => {
    app.get('/test_no_cache', noCache, (request, response) => {
      response.send()
    })

    await request(app)
      .get('/test_no_cache')
      .expect('cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('Pragma', 'no-cache')
      .expect('Expires', '0')
      .expect('Surrogate-Control', 'no-store')
  })
})
