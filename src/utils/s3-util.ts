import AWS from "aws-sdk";
import { config } from "../validations/envValidation";

const s3 = new AWS.S3();
const BUCKET_NAME = config.bucketName;

export const uploadToS3 = async (key: string, data: any) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json",
  };

  try {
    await s3.putObject(params).promise();
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Could not upload data to S3");
  }
};

export const getFromS3 = async (key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    // binary data to UTF-8 string and parse as JSON or empty object
    return data.Body ? JSON.parse(data.Body.toString("utf-8")) : {};
  } catch (error: any) {
    console.error("Error getting data from S3:", error);
    if (error.code !== "NoSuchKey") {
      throw new Error("Could not retrieve data from S3");
    }
  }
};
