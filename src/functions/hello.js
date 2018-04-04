import  {successResponse } from '../utils/'

export const hello = (event, context, callback) => {
  const response = successResponse({
    message: 'Hello, Eugene, im died!!HELP ME SOS'
  })

  callback(null, response)
}
