import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

import "./Category.css";

export default function AddEditCategory() {
  const { categoryId } = useParams(); // used for edit
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch existing category if editing
  useEffect(() => {
    if (categoryId) fetchCategoryData(categoryId);
  }, [categoryId]);

  const fetchCategoryData = async (id) => {
    try {
      const response = await Service.getByIdCategory(id);
      if (response?.status === 200 && response.data) {
        const category = response.data;
        setForm({
          name: category.name || "",
          description: category.description || "",
        });
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to fetch category");
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Category name is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      ...(categoryId && { categoryId }),
    };

    try {

      let response;
      if(!categoryId){
        response = await Service.addCategory(payload);
      }else{
        response = await Service.editCategory(payload);
      }
          
         

      if (response?.status === 200 || response?.status === 201) {
        showToast("success", response?.message || "Category saved");
        navigate("/categories", { state: { refresh: true } });
      } else {
        showToast("error", response?.message || "Save failed");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = () => {
    setForm({ name: "", description: "" });
    setErrors({});
  };

  return (
    <div className="main-form">
      <div className="form-header mb-4">
        <h5>{categoryId ? "Edit Category" : "Add Category"}</h5>
        <button onClick={() => navigate("/categories")} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Category Name */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Category Name<span className="required">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className="save-btn">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
