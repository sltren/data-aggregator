import { Company } from "../../models/company-model";
import { User } from "../../models/user-model";
import { Vulnerability } from "../../models/vulnerability-model";
import { SeverityEnum } from "../../validations/vulnerability-schema";
import { uploadToS3 } from "../../utils/s3-util";

export const aggregateData = async (event: any) => {
  try {
    const companies = await Company.scan();

    if (!companies.Items || companies.Items.length === 0) {
      console.log("No companies found");
      return;
    }

    for (const company of companies.Items) {
      const companyId = company.companyId;
      const companyName = company.companyName;

      const users = await User.query(companyId);
      const vulnerabilities = await Vulnerability.query(companyId);

      const data = formatData(companyName, users.Items, vulnerabilities.Items);
      await saveData(companyId, data);
    }

    console.log("Data aggregation and storage successful");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const formatData = (
  companyName: any | undefined,
  users: any | undefined,
  vulnerabilities: any | undefined
) => {
  const aggregatedData = {
    createdAt: new Date().toISOString(),
    companyName: companyName,
    numberOfUsers: users?.length,
    numberOfVulnerablePackages: 0,
    top3Packages: [],
    totalVulnerabilitiesBySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  } as any;

  const packageVulnerabilities = {} as any;

  vulnerabilities?.forEach(
    (item: { severity: string; packageName: string }) => {
      if (
        item.severity === SeverityEnum.CRITICAL ||
        item.severity === SeverityEnum.HIGH
      ) {
        aggregatedData.numberOfVulnerablePackages += 1;
      }

      if (!packageVulnerabilities[item.packageName]) {
        packageVulnerabilities[item.packageName] = {
          packageName: item.packageName,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
        };
      }
      packageVulnerabilities[item.packageName][item.severity] += 1;
      aggregatedData.totalVulnerabilitiesBySeverity[item.severity] += 1;
    }
  );

  aggregatedData.top3Packages = Object.values(packageVulnerabilities)
    .sort((a: any, b: any) => b.critical + b.high - (a.critical + a.high))
    .slice(0, 3);

  return aggregatedData;
};

const saveData = async (companyId: string, data: any) => {
  const dateStr = new Date().toISOString().split("T")[0];
  const fileName = `${companyId}/history/${dateStr}.json`;
  await uploadToS3(fileName, data);
};
