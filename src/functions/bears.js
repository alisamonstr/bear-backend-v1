import AWS from 'aws-sdk'
import { successResponse } from '../utils/'

const documentClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10', region: 'eu-central-1' })

export const getBears = async (event, context, callback) => {
  const result = await documentClient.scan({ TableName: 'bears-store' }).promise()
  console.log(JSON.stringify(result.Items))

  const response = successResponse(result.Items)
  callback(null, response)
}
