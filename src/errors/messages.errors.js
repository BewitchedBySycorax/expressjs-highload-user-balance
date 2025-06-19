// TODO: throw Errors / classes of errors / errorhandler (not OOP, but middleware)?
// TODO: validators as 'validators' folder
export const ERROR_MESSAGES = {
  INVALID_PARAMETER: (paramName, paramValue) => `Invalid "${paramName}" value passed in request parameters: "${paramValue}"`,
  ENTITY_NOT_FOUND: (entityName, entityId) => `Entity "${entityName}" with id "${entityId}" not found!`,
  INVALID_BALANCE_VALUE: () => `Insufficient funds. The balance cannot be a negative value!`,
  INTERNAL_SERVER: () => `Internal server error occurred!`,
};
