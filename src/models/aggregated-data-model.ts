export interface VulnerabilityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface PackageVulnerability extends VulnerabilityCounts {
  packageName: string;
}

export interface TotalVulnerabilitiesBySeverity extends VulnerabilityCounts {}

export interface CompanyVulnerability {
  createdAt: string;
  companyName: string;
  numberOfUsers: number;
  numberOfVulnerablePackages: number;
  top3Packages: PackageVulnerability[];
  totalVulnerabilitiesBySeverity: TotalVulnerabilitiesBySeverity;
}
