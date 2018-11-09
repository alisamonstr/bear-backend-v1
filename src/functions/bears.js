import { DynamoDB } from 'aws-sdk'

const documentClient = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.region,
  service: new DynamoDB({ apiVersion: '2012-08-10', region: process.env.region }),
})

export const getBears = async () => {
  const result = await documentClient.scan({ TableName: 'bears-store' }).promise()
  return result.Items || []
}
