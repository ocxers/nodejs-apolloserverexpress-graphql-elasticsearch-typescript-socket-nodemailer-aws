import * as Joi from 'joi'

const email = Joi.string().email().min(8).max(254).trim().lowercase().required().label('Email')

/**
 * Method: signInValidator
 *
 * Type: Function
 *
 * Parameters:
 * None
 *
 * Description:
 * This function returns a Joi schema that can be used for validating the input to a sign-in function. The schema
 * includes a single property named "email", which must be a string that is a valid email address with a length between
 * 8 and 254 characters (inclusive).
 *
 * Operations:
 * 1. Define a `StringSchema` object using the `Joi.string()` method.
 * 2. Chain several validation methods to the `StringSchema` object to enforce additional constraints on the string
 * input, such as checking that it is a valid email address, has a minimum length of 8, and a maximum length of 254.
 * 3. Add the `required()` method to indicate that the "email" property is mandatory.
 * 4. Add the `label('Email')` method to set the label of the "email" property to "Email".
 * 5. Define a `Joi.object()` schema with the "email" property.
 * 6. Return the `Joi.object()` schema.
 *
 * Dependencies:
 * - Joi library
 */
export const signInValidator = Joi.object({
  email
})
