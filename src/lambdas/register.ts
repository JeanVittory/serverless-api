import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import middy from "@middy/core";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import { RegisterUserInput } from "../types/register";

const cognito = new CognitoIdentityProvider();

const registerHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body in request" }),
    };
  }

  const body = event.body;

  const { email, password, nickname } = body as unknown as RegisterUserInput;

  if (!email || !password || !nickname) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing required fields in request" }),
    };
  }

  const params = {
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || "",
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "nickname",
        Value: nickname,
      },
    ],
  };
  try {
    await cognito.signUp(params);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export const handler = middy(registerHandler).use(httpJsonBodyParser());
