import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document
    .scan({
      TableName: "todos",
      FilterExpression: "user_id = :id",
      ExpressionAttributeValues: {
        ":id": userid,
      },
    })
    .promise();

  if (!response) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Usuário não possui nenhum to do cadastrado.",
      }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
  };
};
