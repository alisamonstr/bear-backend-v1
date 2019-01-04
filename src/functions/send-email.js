import { SES } from 'aws-sdk'

export const sendEmail = (body) => {
  const params = {
    Destination: {
      ToAddresses: [
        'alisamonstr18@gmail.com',
      ],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `bla bla bla: ${JSON.stringify(body)}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email',
      },
    },
    Source: 'alisamonstr18@gmail.com',
    // ReplyToAddresses: [
    //   'alisamonstr18@gmail.com',
    // ],
  }

  const sendPromise = new SES({ apiVersion: '2010-12-01', region: 'eu-west-1' }).sendEmail(params)
    .promise()

  return sendPromise.then((data) => {
    console.log(data.MessageId)
  })
    .catch((err) => {
      console.error(err, err.stack)
    })
}
