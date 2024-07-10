import AWS, { AWSError } from "aws-sdk";
import { config } from "../validations/envValidation";

const s3 = new AWS.S3();
const BUCKET_NAME = config.bucketName;

export const uploadToS3 = async (key: string, data: any): Promise<void> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };

  try {
    await s3.putObject(params).promise();
  } catch (error) {
    const awsError = error as AWSError;
    console.error("Error uploading to S3:", awsError);
    throw new Error("Could not upload data to S3");
  }
};

export const getFromS3 = async (key: string): Promise<any> => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    // binary data to UTF-8 string and parse as JSON or empty object
    return data.Body ? JSON.parse(data.Body.toString("utf-8")) : {};
  } catch (error) {
    const awsError = error as AWSError;
    console.error("Error getting data from S3:", awsError);
    if (awsError.code !== "NoSuchKey") {
      throw new Error("Could not retrieve data from S3");
    }
  }
};
