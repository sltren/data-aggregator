import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { Company } from "../../models/company-model";
import { companyData as companies } from "../../sample-data/company-data";
import { CompanySchema } from "../../validations/company-schema";

export const seedCompanyData: APIGatewayProxyHandler =
  async (): Promise<APIGatewayProxyResult> => {
    try {
      // Validate companies
      for (const company of companies) {
        const { error } = CompanySchema.validate(company);
        if (error) {
          throw new Error(`Validation error for company: ${error.message}`);
        }
      }

      await Promise.all(companies.map((company) => Company.put(company)));

      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Company data seeded successfully" }),
      };
    } catch (error) {
      const typedError = error as Error;
      console.error("Error seeding company data:", typedError);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: typedError.message }),
      };
    }
  };
