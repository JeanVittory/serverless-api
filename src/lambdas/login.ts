import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  CognitoIdentityProvider,
  AuthFlowType,
} from "@aws-sdk/client-cognito-identity-provider";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { LoginUserInput } from "../types/login";

const cognito = new CognitoIdentityProvider();

const loginHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body in request" }),
    };
  }
  const { email, password } = event.body as unknown as LoginUserInput;
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

export const handler = middy(loginHandler).use(httpJsonBodyParser());
