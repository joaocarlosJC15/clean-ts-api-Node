import { LogErrorRepository } from '../../../../data/protocols/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { Collection } from 'mongodb'

export class LogMongoRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection: Collection = await MongoHelper.getCollection('errors')

    await errorCollection.insertOne({
      stack,
      data: new Date()
    })
  }
}
