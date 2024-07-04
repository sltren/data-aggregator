import Joi from "joi";

const dateSchema = Joi.date().iso().required();

export const validateDateFormat = (date: string) => {
  // validate ISO 8601 date format
  const { error } = dateSchema.validate(date);
  return error ? error.message : null;
};

export const validateDate = (startDate: string, endDate: string) => {
  const startDateError = validateDateFormat(startDate);
  if (startDateError) {
    return `Invalid startDate: ${startDateError}`;
  }

  const endDateError = validateDateFormat(endDate);
  if (endDateError) {
    return `Invalid endDate: ${endDateError}`;
  }

  // validate date range
  if (new Date(startDate) > new Date(endDate)) {
    return "startDate must be before endDate";
  }

  return null;
};
