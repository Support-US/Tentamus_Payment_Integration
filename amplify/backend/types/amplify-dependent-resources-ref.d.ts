export type AmplifyDependentResourcesAttributes = {
  "api": {
    "APIauthorization": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "ComputopWebhook": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    },
    "TentamusPaymentIntegration": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "function": {
    "ComputopWebhook": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "GetPaymentDetails": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    },
    "PaymentDetailResponse": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  }
}