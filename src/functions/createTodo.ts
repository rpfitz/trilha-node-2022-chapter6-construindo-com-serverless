import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { randomUUID } from "crypto";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { userid: user_id } = event.pathParameters;
  const { title, deadline } = JSON.parse(event.body);
  const id = randomUUID();

  await document
    .put({
      TableName: "todos",
      Item: {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline).toDateString(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
