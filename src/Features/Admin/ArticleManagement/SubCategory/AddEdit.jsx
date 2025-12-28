import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

import "./Category.css";

export default function AddEditSubCategory() {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategory, setLoadingSubCategory] = useState(false);

  // Fetch all categories
  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await Service.getListCategories();
      console.log("Full category response:", response);

      // Adjust path according to actual API response
      const categoryList =
        response?.data?.data?.result || response?.data?.result || [];

      if (Array.isArray(categoryList) && categoryList.length > 0) {
        setCategories(categoryList);
        if (subCategoryId) fetchSubCategoryData(subCategoryId);
      } else {
        setCategories([]);
        console.log("No categories found");
      }
    } catch (err) {
      setCategories([]);
      showToast(
        "error",
        err?.response?.data?.message || "Failed to load categories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategory data if editing
  const fetchSubCategoryData = async (id) => {
    console.log("subcategory fetching ", id);
    setLoadingSubCategory(true);
    try {
      const response = await Service.getByIdSubCategory(id);
      if (response?.status === 200 && response.data) {
        const subCategory = response.data;
        setForm({
          name: subCategory.name || "",
          description: subCategory.description || "",
          categoryId: subCategory.categoryId || "",
        });
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch subcategory"
      );
    } finally {
      setLoadingSubCategory(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
    // if (subCategoryId) fetchSubCategoryData(subCategoryId);
  }, [subCategoryId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validate = () => {
    const errs = {};
    if (!form.categoryId) errs.categoryId = "Please select a category";
    if (!form.name.trim()) errs.name = "Subcategory name is required";
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
      categoryId: form.categoryId,
      ...(subCategoryId && { subCategoryId }),
    };

    try {
      const response = subCategoryId
        ? await Service.editSubCategory(payload)
        : await Service.addSubCategory(payload);

      if (response?.status === 200 || response?.status === 201) {
        showToast("success", response?.message || "Subcategory saved");
        navigate("/subcategories", { state: { refresh: true } });
      } else {
        showToast("error", response?.message || "Save failed");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  // Reset form
  const handleReset = () => {
    setForm({ name: "", description: "", categoryId: "" });
    setErrors({});
  };

  return (
    <div className="main-form">
      <div className="form-header mb-4">
        <h5>{subCategoryId ? "Edit Subcategory" : "Add Subcategory"}</h5>
        <button
          onClick={() => navigate("/subcategories")}
          className="back-button"
        >
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Category Dropdown */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Parent Category<span className="required">*</span>
            </label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              disabled={loadingCategories}
            >
              {loadingCategories ? (
                <option>Loading categories...</option>
              ) : categories.length > 0 ? (
                <>
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </>
              ) : (
                <option disabled>No categories available</option>
              )}
            </select>
            {errors.categoryId && (
              <span className="error">{errors.categoryId}</span>
            )}
          </div>
        </div>

        {/* Subcategory Name */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Subcategory Name<span className="required">*</span>
            </label>
            <input name="name" value={form.name} onChange={handleChange} />
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
          <button
            type="submit"
            className="save-btn"
            disabled={loadingCategories || loadingSubCategory}
          >
            {loadingSubCategory ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
