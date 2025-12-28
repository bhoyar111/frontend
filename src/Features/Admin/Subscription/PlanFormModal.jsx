import React, { useState, useEffect } from 'react';
import './PlanFormModal.css'; // style as needed
import Select from 'react-select';
import Service from './Services';
import showToast from '../../Common/Shared/Utils/ToastNotification';

const PlanFormModal = ({ isOpen, onClose, onSubmit, servicesList = [], durations = [], defaultData = null }) => {
  const [formData, setFormData] = useState({
    planName: '',
    description: '',
    services: [],
    discountPercentage: 0,
    planPrice: 0,
    planDuration: ''
  });

  const [errors, setErrors] = useState({});

  const convertToOptions = (values) =>
    values.map((val) => ({ value: val, label: val }));

  useEffect(() => {
    if (defaultData) {
      setFormData({
        ...defaultData,
        services: convertToOptions(defaultData.services || [])
      });
    } else {
      setFormData({
        planName: '',
        description: '',
        services: [],
        discountPercentage: 0,
        planPrice: 0,
        planDuration: ''
      });
    }
    setErrors({});
  }, [defaultData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the specific field
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.planName.trim()) newErrors.planName = 'Plan name is required.';
    if (!formData.services.length) newErrors.services = 'At least one service must be selected.';
    if (formData.planPrice === 0 || isNaN(formData.planPrice)) newErrors.planPrice = 'Plan price is required.';
    if (!formData.planDuration) newErrors.planDuration = 'Plan duration is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      planName: formData?.planName,
      description: formData?.description,
      discountPercentage: formData?.discountPercentage,
      planPrice: formData?.planPrice,
      planDuration: formData?.planDuration,
      services: formData.services.map((opt) => opt.value),
      ...(formData?._id && { planId: formData._id })
    };
    try {
      const response = await Service.addUpdatePlan(payload);
      if (response?.status === 200) {
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message);
      }
      onSubmit(payload);  // Notify parent to refresh table
      onClose();   // Close modal
    } catch (error) {
      showToast("error", error?.response?.message || "Action failed");
    }
  };

  if (!isOpen) return null;
  const isReadOnly = !!defaultData;

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <div className="modal-header">
          <h6>{defaultData ? "View Plan Details" : "Add Plan"}</h6>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="popup-container">
          <div className="modal-body">
            <label>Plan Name</label>
            <input
              type="text"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              className={errors.planName ? "error-input" : ""}
              readOnly={isReadOnly}
            />
            {errors.planName && <div className="error">{errors.planName}</div>}

            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              readOnly={isReadOnly}
            />

            <div className="form-group">
              <label>Services</label>
              <Select
                isMulti
                name="services"
                options={servicesList}
                className="basic-multi-select"
                classNamePrefix="select"
                value={formData.services}
                onChange={(selectedOptions) => {
                  if (isReadOnly) return;
                  setFormData({ ...formData, services: selectedOptions });
                  if (errors.services && selectedOptions.length > 0) {
                    setErrors((prevErrors) => {
                      const newErrors = { ...prevErrors };
                      delete newErrors.services;
                      return newErrors;
                    });
                  }
                }}
              />
              {errors.services && (
                <div className="error">{errors.services}</div>
              )}
            </div>

            <div className="popup-form-row">
              <div className="popup-form-group">
                <label>Duration*</label>
                <select
                  name="planDuration"
                  value={formData.planDuration}
                  onChange={handleChange}
                  disabled={isReadOnly}
                >
                  <option value="">Select</option>
                  {durations.map((dur, idx) => (
                    <option key={idx} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
                {errors.planDuration && (
                  <div className="error">{errors.planDuration}</div>
                )}
              </div>
              <div className="popup-form-group">
                <label>Plan Price($)</label>
                <input
                  type="number"
                  name="planPrice"
                  value={formData.planPrice}
                  onChange={handleChange}
                  min={0}
                  readOnly={isReadOnly}
                />
                {errors.planPrice && (
                  <div className="error">{errors.planPrice}</div>
                )}
              </div>
              <div className="popup-form-group">
                <label>Discount %</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  min={0}
                  max={100}
                  readOnly={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn cancel" onClick={onClose}>
              Cancel
            </button>
            {!defaultData && (
              <button className="btn submit" onClick={handleSubmit}>
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanFormModal;
