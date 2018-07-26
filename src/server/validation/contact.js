var Joi = require('joi');

var phoneObject = Joi.object().keys({
  number: Joi.string().regex(/[0-9]{3}-[0-9]{3}-[0-9]{4}/).required(),
  type: Joi.string()
});
 
module.exports = {
  body: {
    email: Joi.string().required(),
    name: Joi.string().required(),
    jobTitle: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.array().items(phoneObject)
  }
};