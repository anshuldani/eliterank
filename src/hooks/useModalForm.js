import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing modal form state
 * Eliminates duplicate form logic across modal components
 *
 * @param {Object} initialState - Default form values
 * @param {Object} existingData - Existing data when editing (e.g., judge, sponsor)
 * @param {boolean} isOpen - Whether the modal is open
 * @returns {Object} Form state and handlers
 */
export default function useModalForm(initialState, existingData, isOpen) {
  const [form, setForm] = useState(initialState);

  // Reset form when modal opens/closes or data changes
  useEffect(() => {
    if (isOpen) {
      if (existingData) {
        // Merge existing data with initial state to handle missing fields
        setForm({ ...initialState, ...existingData });
      } else {
        setForm(initialState);
      }
    }
  }, [existingData, isOpen]);

  // Update a single form field
  const updateField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update multiple fields at once
  const updateFields = useCallback((updates) => {
    setForm(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setForm(initialState);
  }, [initialState]);

  // Get form data for saving
  const getFormData = useCallback(() => {
    return { ...form };
  }, [form]);

  // Handle input change events
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  return {
    form,
    setForm,
    updateField,
    updateFields,
    resetForm,
    getFormData,
    handleChange,
  };
}
