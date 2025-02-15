import { APIGatewayProxyHandler } from "aws-lambda";
import {
  CognitoIdentityProvider,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";

const cognito = new CognitoIdentityProvider();

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const { email, password } = body;
  const params = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || "",
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  };
  try {
    const response = await cognito.initiateAuth(params);
    return {
      statusCode: 200,
      body: JSON.stringify(response.AuthenticationResult),
    };
  } catch (error) {
    if (error.name === "UserNotConfirmedException") {
      return {
        statusCode: error.$metadata.httpStatusCode,
        body: JSON.stringify({ message: error.name }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
