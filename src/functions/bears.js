import { DynamoDB } from 'aws-sdk'

const documentClient = new DynamoDB.DocumentClient({
  apiVersion: '2012-08-10',
  region: process.env.region,
  service: new DynamoDB({
    apiVersion: '2012-08-10',
    region: process.env.region,
  }),
})

export const getBears = async () => {
  const result = await documentClient.scan({ TableName: 'bears-store' })
    .promise()
  return (result.Items.sort((a, b) => Number(a.id) - Number(b.id)) || [])
}

export const updateBears = async (bear) => {
  if (!bear.id) {
    const allBears = await getBears()
    const maxId = Math.max(...allBears.map(x => Number(x.id)))
    // eslint-disable-next-line no-param-reassign
    bear.id = `${maxId + 1}`
  }
  const params = {
    TableName: 'bears-store',
    Item: bear,
  }
  await documentClient.put(params)
    .promise()
  return bear
}

export const deleteBear = async (bearId) => {
  const params = {
    TableName: 'bears-store',
    Key: bearId,
  }
  await documentClient.delete(params)
    .promise()
  return getBears()
}
