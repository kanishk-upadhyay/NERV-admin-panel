import { useState, useCallback } from "react";

/**
 * Form State Management Hook
 *
 * Handles form values, validation, and error states with real-time feedback.
 *
 * @param {Object} initialValues - Initial form field values
 * @param {Function} validate - Validation function that returns error object
 * @returns {Object} Form state and handlers
 *
 * @example
 * const { values, errors, handleChange, isValid } = useForm(
 *   { name: '', email: '' },
 *   (vals) => {
 *     const errs = {};
 *     if (!vals.email) errs.email = 'Required';
 *     return errs;
 *   }
 * );
 */
export const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear field error on user input for better UX
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors],
  );

  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(newValues);
      setErrors({});
    },
    [initialValues],
  );

  const isValid = useCallback(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validate]);

  return {
    values,
    errors,
    handleChange,
    resetForm,
    isValid,
    setValues,
    setErrors,
  };
};
