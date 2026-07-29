// src/utils/parseApiError.js
// The backend (see backend errorHandler.middleware.js and
// validate.middleware.js) always returns errors as either:
//   { success: false, message: "...", errors: null }
//   { success: false, message: "Validation failed", errors: [{ field, message }, ...] }
// This helper turns that into a single shape components can render
// directly: a general message plus a field -> message map.

export function parseApiError(error) {
  const data = error?.response?.data;
  const fieldErrors = {};

  if (Array.isArray(data?.errors)) {
    data.errors.forEach((item) => {
      if (item?.field) {
        fieldErrors[item.field] = item.message;
      }
    });
  }

  const message = data?.message || 'Something went wrong. Please try again.';

  return { message, fieldErrors };
}
