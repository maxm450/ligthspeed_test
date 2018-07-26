var Joi = require('joi');
 
module.exports = {
  body: {
    email: Joi.string(),
    name: Joi.string().required(),
    jobTitle: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/).required(),
  }
};