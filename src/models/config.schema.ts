import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
    PORT: Joi.number().required().default(3000),
    STAGE: Joi.string().required().default('localhost'),
    DB_TYPE: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required().default(5432),
    DB_NAME: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES: Joi.number().required(),
})