import Joi from "joi";

// Define the validation schema
const envSchema = Joi.object({
  COMPANIES_TABLE: Joi.string().required(),
  USERS_TABLE: Joi.string().required(),
  VULNERABILITIES_TABLE: Joi.string().required(),
  BUCKET_NAME: Joi.string().required(),
  IS_OFFLINE: Joi.boolean().required(),
}).unknown(); // Allow other environment variables that are not defined in the schema

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

// Export the validated environment variables
export const config = {
  companiesTable: envVars.COMPANIES_TABLE as string,
  usersTable: envVars.USERS_TABLE as string,
  vulnerabilitiesTable: envVars.VULNERABILITIES_TABLE as string,
  bucketName: envVars.BUCKET_NAME as string,
  isOffline: envVars.IS_OFFLINE as boolean,
};
