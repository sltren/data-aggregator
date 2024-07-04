import { APIGatewayProxyHandler } from "aws-lambda";
import { Company } from "../../models/company-model";
import { companyData as companies } from "../../sample-data/company-data";
import { CompanySchema } from "../../validations/company-schema";

export const seedCompanyData: APIGatewayProxyHandler = async () => {
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
  } catch (error: any) {
    console.error("Error seeding company data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error?.message }),
    };
  }
};
