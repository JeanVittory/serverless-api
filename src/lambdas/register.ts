
import {APIGatewayProxyHandler} from "aws-lambda"
import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider"

const cognito = new CognitoIdentityProvider()

export const handler:APIGatewayProxyHandler = async (event) => {

    if(!event.body){
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing body in request"})
        }
    }

    const body = JSON.parse(event.body || "{}")

    const {email, password, nickname} = body

    if(!email || !password || !nickname){
        return {
            statusCode: 400,
            body: JSON.stringify({message: "Missing required fields in request"})
        }
    }

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
         await cognito.signUp(params)

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