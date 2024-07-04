import Joi from "joi";

export const CompanySchema = Joi.object({
  companyId: Joi.string().required(),
  companyName: Joi.string().required(),
});
