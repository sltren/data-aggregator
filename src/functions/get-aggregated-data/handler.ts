import { APIGatewayProxyHandler } from "aws-lambda";
import { validateDate } from "../../validations/date-validation";
import { getFromS3 } from "../../utils/s3-util";
import { CompanyVulnerability } from "../../models/aggregated-data-model";

export const getAggregatedData: APIGatewayProxyHandler = async (event: any) => {
  const companyId = event.pathParameters.companyId;
  const startDate = event.queryStringParameters.startDate;
  const endDate = event.queryStringParameters.endDate;

  const dateError = validateDate(startDate, endDate);
  if (dateError) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: dateError }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  try {
    const data = (await fetchAggregatedData(
      companyId,
      startDate,
      endDate
    )) as CompanyVulnerability[];
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

async function fetchAggregatedData(
  companyId: string,
  startDate: string,
  endDate: string
): Promise<CompanyVulnerability[]> {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: CompanyVulnerability[] = [];

  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const fileName = `${companyId}/history/${dateStr}.json`;

    const fileData = (await getFromS3(fileName)) as CompanyVulnerability;

    if (fileData && Object.keys(fileData).length > 0) {
      data.push(fileData);
      console.log(`File data added to result: ${fileData}`);
    } else {
      console.log(
        `File data is empty and was not added to the result for the key: ${fileName}`
      );
    }
  }

  return data;
}
