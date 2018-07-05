import  {successResponse } from '../utils/'

export const hello = (event, context, callback) => {
  const response = successResponse({
    message: 'Hello, World'
  })

  callback(null, response)
}
