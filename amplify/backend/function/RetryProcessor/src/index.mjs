const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

exports.handler = async (event, context) => {
    const retryQueueUrl = process.env.RETRY_QUEUE_URL;

    try {
        // Your logic to receive and process messages from the Retry Queue
        const params = {
            QueueUrl: retryQueueUrl,
            MaxNumberOfMessages: 10,
            VisibilityTimeout: 30,
            WaitTimeSeconds: 20
        };

        const data = await sqs.receiveMessage(params).promise();

        if (data.Messages) {
            // Process the messages and implement your retry logic
            // ...
        }

        return { statusCode: 200, body: 'Messages processed successfully' };
    } catch (error) {
        console.error(error);
        return { statusCode: 500, body: 'Error processing messages' };
    }
};
