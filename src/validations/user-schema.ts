import Joi from "joi";

export const UserSchema = Joi.object({
  companyId: Joi.string().required(),
  userId: Joi.string().required(),
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
});
