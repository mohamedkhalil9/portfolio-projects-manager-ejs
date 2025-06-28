import Joi from "joi";
import JoiObjectid from "joi-objectid";

Joi.objectId = JoiObjectid(Joi);

export const mongoId = Joi.object({
  id: Joi.objectId().required(),
});

export const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "First name can only contain letters, spaces, hyphens, and apostrophes",
      "string.min": "First name cannot be empty",
      "string.max": "First name cannot exceed 50 characters",
    }),
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Last name can only contain letters, spaces, hyphens, and apostrophes",
      "string.min": "Last name cannot be empty",
      "string.max": "Last name cannot exceed 50 characters",
    }),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({
      minDomainSegments: 2,
      tlds: { allow: true },
    })
    .max(254) // RFC 5321 limit
    .required()
    .messages({
      "string.email": "Please provide a valid email address",
      "string.max": "Email address is too long",
    }),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    }),
  role: Joi.string()
    .valid("USER", "ADMIN", "MANAGER")
    .default("USER")
    .messages({
      "any.only": "Role must be one of: USER, ADMIN, MANAGER",
    }),
  gender: Joi.string().valid("Male", "Female").messages({
    "any.only": "Gender must be one of: Male, Female",
  }),
  dateOfBirth: Joi.date().max("now").min("1900-01-01").iso().messages({
    "date.max": "Date of birth cannot be in the future",
    "date.min": "Date of birth must be after 1900",
    "date.format": "Date of birth must be in ISO format (YYYY-MM-DD)",
  }),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .min(7)
    .max(15)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international format (e.g., +1234567890)",
      "string.min": "Phone number must be at least 7 digits",
      "string.max": "Phone number cannot exceed 15 digits",
    }),
  country: Joi.string()
    .length(2)
    .uppercase()
    .pattern(/^[A-Z]{2}$/)
    .messages({
      "string.length": "Country must be a 2-letter ISO country code",
      "string.pattern.base":
        "Country must be a valid ISO 3166-1 alpha-2 country code (e.g., US, GB, CA)",
    }),
  address: Joi.string().trim().min(5).max(500).messages({
    "string.min": "Address must be at least 5 characters long",
    "string.max": "Address cannot exceed 500 characters",
  }),
})
  .with("phone", "country") // If phone is provided, country should also be provided
  .messages({
    "object.with": "Country is required when phone number is provided",
  });

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const resetPassSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    }),
  confirmPassword: Joi.ref("password"),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .messages({
      "string.pattern.base":
        "First name can only contain letters, spaces, hyphens, and apostrophes",
      "string.min": "First name cannot be empty",
      "string.max": "First name cannot exceed 50 characters",
    }),
  lastName: Joi.string()
    .trim()
    .min(1)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s'-]+$/)
    .messages({
      "string.pattern.base":
        "Last name can only contain letters, spaces, hyphens, and apostrophes",
      "string.min": "Last name cannot be empty",
      "string.max": "Last name cannot exceed 50 characters",
    }),
  // email: Joi.string()
  //   .trim()
  //   .lowercase()
  //   .email({
  //     minDomainSegments: 2,
  //     tlds: { allow: true },
  //   })
  //   .max(254) // RFC 5321 limit
  //   .required()
  //   .messages({
  //     "string.email": "Please provide a valid email address",
  //     "string.max": "Email address is too long",
  //   }),
  phone: Joi.string()
    .trim()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .min(7)
    .max(15)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid international format (e.g., +1234567890)",
      "string.min": "Phone number must be at least 7 digits",
      "string.max": "Phone number cannot exceed 15 digits",
    }),
});

export const updatePassSchema = Joi.object({
  password: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 128 characters",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    }),
});
