
import {APIGatewayProxyHandler} from "aws-lambda"
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider"

const cognito = new CognitoIdentityProvider()

export const handler:APIGatewayProxyHandler = async (event) => {
    const body = JSON.parse(event.body || "{}")
    const {email, password, nickname} = body
    const params = {
        ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || "",
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: "email",
                Value: email
            }, 
            {
                Name: "nickname",
                Value: nickname
            }
        ]
    }
    try {
        const result = await cognito.signUp(params)
        console.log(result)
        return {
            statusCode: 200,
            body: JSON.stringify({message: "User registered successfully"})
        }
    } catch (error) {
       return {
        statusCode: 500 ,
        body: JSON.stringify({message: error.message})
       } 
    }
}