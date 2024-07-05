import { Company } from "../../models/company-model";
import { User } from "../../models/user-model";
import { Vulnerability } from "../../models/vulnerability-model";
import { SeverityEnum } from "../../validations/vulnerability-schema";
import { uploadToS3 } from "../../utils/s3-util";
import {
  CompanyItem,
  CompanyVulnerability,
  PackageVulnerability,
  QueryResult,
  TotalVulnerabilitiesBySeverity,
  VulnerabilityItem,
} from "../../models/aggregated-data-model";

export const aggregateData = async (event: any) => {
  try {
    const companies =
      (await Company.scan()) as unknown as QueryResult<CompanyItem>;

    if (!companies.Items || companies.Items.length === 0) {
      console.log("No companies found");
      return;
    }

    for (const company of companies.Items) {
      const companyId = company.companyId;
      const companyName = company.companyName;

      const usersCount = (
        await User.query(companyId, {
          select: "COUNT",
        })
      ).Count as number;

      const vulnerabilities = (await Vulnerability.query(
        companyId
      )) as unknown as QueryResult<VulnerabilityItem>;

      const data = formatData(
        companyName,
        usersCount,
        vulnerabilities
      ) as CompanyVulnerability;

      await saveData(companyId, data);
    }

    console.log("Data aggregation and storage successful");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const formatData = (
  companyName: string,
  usersCount: number,
  vulnerabilities: QueryResult<VulnerabilityItem>
) => {
  const aggregatedData: CompanyVulnerability = {
    createdAt: new Date().toISOString(),
    companyName: companyName,
    numberOfUsers: usersCount,
    numberOfVulnerablePackages: 0,
    top3Packages: [],
    totalVulnerabilitiesBySeverity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    },
  };

  // object type with string keys and values of type PackageVulnerability
  const packageVulnerabilities: Record<string, PackageVulnerability> = {};

  vulnerabilities?.Items?.forEach(
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
      packageVulnerabilities[item.packageName][
        item.severity as keyof TotalVulnerabilitiesBySeverity
      ] += 1;
      aggregatedData.totalVulnerabilitiesBySeverity[
        item.severity as keyof TotalVulnerabilitiesBySeverity
      ] += 1;
    }
  );

  aggregatedData.top3Packages = Object.values(packageVulnerabilities)
    .sort(
      (a: PackageVulnerability, b: PackageVulnerability) =>
        b.critical + b.high - (a.critical + a.high)
    )
    .slice(0, 3);

  return aggregatedData;
};

const saveData = async (companyId: string, data: CompanyVulnerability) => {
  const dateStr = new Date().toISOString().split("T")[0];
  const fileName = `${companyId}/history/${dateStr}.json`;
  await uploadToS3(fileName, data);
};
