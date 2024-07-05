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
