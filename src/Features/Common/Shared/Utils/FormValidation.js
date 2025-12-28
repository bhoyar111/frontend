export const validateForm = (fields, formData) => {
  const errors = {};

  fields.forEach(field => {
    const value = formData[field.name];

    if (field.required) {
      if (field.type === 'checkbox' && !value) {
        errors[field.name] = `${field.label || field.name} is required`;
        return;
      }

      if (field.type === 'checkbox-group' && (!value || value.length === 0)) {
        errors[field.name] = `Please select at least one ${field.label || field.name}`;
        return;
      }

      if (
        (field.type !== 'checkbox' && field.type !== 'checkbox-group') &&
        (!value || value.toString().trim() === '')
      ) {
        errors[field.name] = `${field.label || field.name} is required`;
        return;
      }
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field.name] = 'Invalid email address';
        return;
      }
    }
    if (field.type === 'password' && value) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]{1,8}$/;
      if (!passwordRegex.test(value)) {
        errors[field.name] = 'Password must have 1 uppercase, 1 lowercase, 1 number, 1 special char, max 8 chars';
        return;
      }
    }
    if (field.name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        errors[field.name] = 'Passwords does not match';
      }
    }
    if (field.type === 'date-group' && field.required) {
      if (!value || value.some(v => !v)) {
        errors[field.name] = `All ${field.label || field.name} must be filled`;
        return;
      }
    }

    if (field.type === 'otp') {
      if (!Array.isArray(value) || value.some((digit) => digit.trim() === '')) {
        errors[field.name] = `Please enter all digits`;
        return;
      }
    }
  });

  return errors;
};
