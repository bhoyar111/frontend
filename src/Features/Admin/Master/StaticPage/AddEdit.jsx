import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import "./StaticPage.css";

export default function AddEditStaticPage() {
  const { staticPageId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(staticPageId);

  const [form, setForm] = useState({
    title: "",
    heading: "",
    slug: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [quillInitialized, setQuillInitialized] = useState(false);

  const contentRef = useRef(null);
  const quillInstance = useRef(null);

  // ----------------------------
  // Utility: Generate slug
  // ----------------------------
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const initializeQuill = (content = "") => {
    if (!contentRef.current || quillInstance.current) return;

    quillInstance.current = new Quill(contentRef.current, {
      theme: "snow",
      placeholder: "Enter page content...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image", "video", "clean"],
        ],
      },
    });

    // Set content if provided
    if (content) {
      // Use a small delay to ensure Quill is fully initialized
      setTimeout(() => {
        if (quillInstance.current) {
          quillInstance.current.setText(""); // Clear existing content
          quillInstance.current.clipboard.dangerouslyPasteHTML(content);
        }
      }, 50);
    }

    setQuillInitialized(true);
  };

  // ----------------------------
  // Fetch data for Edit mode
  // ----------------------------
  const fetchPageData = async (pageId) => {
    setLoadingPage(true);
    try {
      const response = await Service.getStaticPageById(pageId);
      if (response?.status === 200 && response.data?.data) {
        const page = response.data.data;
        setForm({
          title: page.title || "",
          heading: page.heading || "",
          slug: page.slug || "",
          content: page.content || "",
          metaTitle: page.metaTitle || "",
          metaDescription: page.metaDescription || "",
          isActive: page.isActive ?? true,
        });
      } else {
        showToast("error", "Failed to fetch page data");
        navigate("/static-pages");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch page data"
      );
      navigate("/static-pages");
    } finally {
      setLoadingPage(false);
    }
  };

  // ----------------------------
  // Effects
  // ----------------------------

  // Fetch data if edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchPageData(staticPageId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staticPageId, isEditMode]);

  // Initialize Quill after data is loaded
  useEffect(() => {
    if (!isEditMode && !quillInitialized) {
      initializeQuill();
    } else if (
      isEditMode &&
      !loadingPage &&
      form.content &&
      !quillInitialized
    ) {
      initializeQuill(form.content);
    }
  }, [isEditMode, loadingPage, form.content, quillInitialized]);

  // Ensure proper height styling
  useEffect(() => {
    if (quillInstance.current) {
      quillInstance.current.root.style.minHeight = "350px";
    }
  }, [quillInitialized]);

  // ----------------------------
  // Handlers
  // ----------------------------

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "title" && !isEditMode) {
      const slugValue = generateSlug(value);
      setForm((prev) => ({ ...prev, title: value, slug: slugValue }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.slug.trim()) errs.slug = "Slug is required";

    const content = quillInstance.current?.root.innerHTML;
    if (!content || content === "<p><br></p>")
      errs.content = "Content is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const content = quillInstance.current.root.innerHTML;
      const pageData = { ...form, content };

      const response = isEditMode
        ? await Service.updateStaticPage(staticPageId, pageData)
        : await Service.createStaticPage(pageData);

      if (response?.status === 200 || response?.status === 201) {
        showToast("success", response?.message || "Page saved successfully");
        navigate("/static-pages", { state: { refresh: true } });
      } else {
        showToast("error", response?.message || "Failed to save page");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: "",
      slug: "",
      heading: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      isActive: true,
    });
    if (quillInstance.current) quillInstance.current.setText("");
    setErrors({});
  };

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="main-form">
      <div className="form-header">
        <h5>{isEditMode ? "Edit Static Page" : "Add Static Page"}</h5>
        <button
          onClick={() => navigate("/static-pages")}
          className="back-button"
        >
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      {loadingPage ? (
        <div className="loading-container">Loading page data...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Title & Slug */}
          <div
            className="form-row mb-3"
            style={{ display: "flex", gap: "20px" }}
          >
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Title<span className="required">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter page title"
              />
              {errors.title && <span className="error">{errors.title}</span>}
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>
                Slug<span className="required">*</span>
              </label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                readOnly
                placeholder="url-friendly-slug"
                style={{
                  backgroundColor: "#f8f9fa",
                  cursor: "not-allowed",
                }}
              />
              {errors.slug && <span className="error">{errors.slug}</span>}
              <small style={{ color: "#666", fontSize: "12px" }}>
                URL-friendly version of the title{" "}
                {!isEditMode && form.title && (
                  <span style={{ color: "#28a745", marginLeft: "5px" }}>
                    ✓ Auto-generated
                  </span>
                )}
                {isEditMode && (
                  <span style={{ color: "#dc3545", marginLeft: "5px" }}>
                    (Cannot be changed)
                  </span>
                )}
              </small>
            </div>
             <div className="form-group" style={{ flex: 1 }}>
              <label>
                Topic
              </label>
              <input
                name="heading"
                value={form.heading}
                onChange={handleChange}
                placeholder="Enter page topic"
              />
            </div>
          </div>

          {/* Content */}
          <div className="form-row mb-3">
            <div className="form-group">
              <label>
                Content<span className="required">*</span>
              </label>
              <div
                ref={contentRef}
                style={{
                  height: "350px",
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {errors.content && (
                <span className="error">{errors.content}</span>
              )}
            </div>
          </div>

          {/* Meta Info */}
          {/* <div className="form-row mb-3" style={{ display: "flex", gap: "20px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Meta Title</label>
              <input
                name="metaTitle"
                value={form.metaTitle}
                onChange={handleChange}
                placeholder="SEO title (optional)"
              />
              <small style={{ color: "#666", fontSize: "12px" }}>
                Recommended: 50-60 characters
              </small>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Meta Description</label>
              <textarea
                name="metaDescription"
                value={form.metaDescription}
                onChange={handleChange}
                placeholder="SEO description (optional)"
                rows={2}
              />
              <small style={{ color: "#666", fontSize: "12px" }}>
                Recommended: 150-160 characters
              </small>
            </div>
          </div> */}

          {/* Status Toggle */}
          {/* <div className="form-row mb-3">
            <div className="form-group">
              <label>Status</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, isActive: !prev.isActive }))
                  }
                  className={`toggle-btn ${form.isActive ? "active" : "inactive"}`}
                  style={{
                    background: form.isActive ? "#28a745" : "#dc3545",
                    border: "none",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  {form.isActive ? <FaToggleOn /> : <FaToggleOff />}
                  {form.isActive ? "Active" : "Inactive"}
                </button>
                <span style={{ marginLeft: "10px", color: "#666" }}>
                  {form.isActive
                    ? "Page is visible to visitors"
                    : "Page is hidden from visitors"}
                </span>
              </div>
            </div>
          </div> */}

          {/* Buttons */}
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleReset}>
              Reset
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Page" : "Save Page"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
