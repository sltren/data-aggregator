export interface CompanyItem {
  companyId: string;
  companyName: string;
}

export interface UserItem {
  companyId: string;
  userId: string;
  email: string;
  fulName: string;
}

export interface VulnerabilityItem {
  companyId: string;
  vulnerabilityId: string;
  packageType: string;
  packageName: string;
  packageVersion: string;
  description: string;
  severity: string;
}

export interface QueryResult<T> {
  Items: T[];
}

export interface PackageVulnerability {
  packageName: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface TotalVulnerabilitiesBySeverity {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface CompanyVulnerability {
  createdAt: string;
  companyName: string;
  numberOfUsers: number;
  numberOfVulnerablePackages: number;
  top3Packages: PackageVulnerability[];
  totalVulnerabilitiesBySeverity: TotalVulnerabilitiesBySeverity;
}
