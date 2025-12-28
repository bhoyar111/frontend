import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";

import Service from "../Services";
import FileControl from "../../../Common/Shared/Components/FileControl/FileControl";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./Article.css";

export default function AddEditArticle() {
  const { articleId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    descriptionDelta: null,
    additionalDescription: "",
    category: "",
    subCategory: "",
    mediaType: "image",
    mediaFiles: [], // store uploaded URLs here
    questions: [""],
    thumbnailURL: "",
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(false);

  const descriptionRef = useRef(null);
  const quillInstance = useRef(null);

  // Initialize Quill
  useEffect(() => {
    if (descriptionRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(descriptionRef.current, {
        theme: "snow",
        placeholder: "Enter description...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
            ["link", "clean"],
          ],
        },
      });
    }
  }, []);

  // Fetch categories
  const fetchAllCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await Service.getListCategories();
      const categoryList =
        response?.data?.data?.result || response?.data?.result || [];
      setCategories(categoryList);
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to load categories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }
    setLoadingSubCategories(true);
    try {
      const response = await Service.getListSubCategories({ categoryId });
      const list = response?.data?.result || [];
      setSubCategories(list);
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to load subcategories"
      );
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // Fetch article data
  const fetchArticleData = async (id) => {
    setLoadingArticle(true);
    try {
      const response = await Service.getByIdArticle(id);
      if (response?.status === 200 && response.data) {
        const article = response.data;

        setForm({
          title: article.title || "",
          descriptionDelta:
            article.descriptionDelta || article.description || null,
          additionalDescription: article.additionalDescription || "",
          category: article.category?._id || "",
          subCategory: article.subCategory?._id || "",
          mediaType: article.mediaType || "image",
          mediaFiles: "", // set uploaded URLs
          questions: article.questions?.length ? article.questions : [""],
          thumbnailURL: article.thumbnailURL,
        });

        if (article?.mediaURL) {
          previewImageFile(article?.mediaURL[0]);
        }

        if (article?.thumbnailURL) {
          previewThambnailFile(article?.thumbnailURL);
        }

        if (article.category?._id)
          await fetchSubCategories(article.category._id);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch article"
      );
    } finally {
      setLoadingArticle(false);
    }
  };

  // Set Quill content when descriptionDelta changes
  useEffect(() => {
    if (quillInstance.current && form.descriptionDelta) {
      try {
        const delta =
          typeof form.descriptionDelta === "string"
            ? JSON.parse(form.descriptionDelta)
            : form.descriptionDelta;
        quillInstance.current.setContents(delta);
      } catch (err) {
        quillInstance.current.root.innerHTML = form.descriptionDelta || "";
      }
    }
  }, [form.descriptionDelta]);

  useEffect(() => {
    fetchAllCategories();
    if (articleId) fetchArticleData(articleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "category") {
      setForm((prev) => ({ ...prev, subCategory: "" }));
      fetchSubCategories(value);
    }

    if (name === "mediaType") {
      setPreviewImages([]);
    }
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index] = value;
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setForm((prev) => ({ ...prev, questions: [...prev.questions, ""] }));
  };

  const removeQuestion = (index) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions.splice(index, 1);
    setForm((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";

    const delta = quillInstance.current?.getContents();
    if (!delta || (delta.ops.length === 1 && delta.ops[0].insert === "\n"))
      errs.description = "Description is required";

    if (!form.category) errs.category = "Please select a category";
    if (!form.subCategory) errs.subCategory = "Please select a subcategory";
    if (!form.mediaType) errs.mediaType = "Please select media type";
    if (!form.mediaFiles.length && !existingImages.length && !articleId)
      errs.mediaFiles = "Please upload at least one file";

    const hasValidQuestion = form.questions.some((q) => q.trim() !== "");
    if (!hasValidQuestion) errs.questions = "Please add at least one question";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append("title", form.title.trim());

    const delta = quillInstance.current.getContents();
    const html = quillInstance.current.root.innerHTML;
    formData.append("descriptionDelta", JSON.stringify(delta));
    formData.append("description", html);

    formData.append("additionalDescription", form.additionalDescription.trim());
    formData.append("category", form.category);
    formData.append("subCategory", form.subCategory);
    formData.append("mediaType", form.mediaType);

    form.questions.forEach((q) => formData.append("questions", q));

    // Append media URLs
    formData.append("mediaURL", form.mediaFiles);
    // Thumbnail
    formData.append("thumbnailURL", form.thumbnailURL);

    try {
      const response = articleId
        ? await Service.editArticle(articleId, formData, {
            skipEncryption: true,
          })
        : await Service.addArticle(formData, { skipEncryption: true });

      if (response?.status === 200 || response?.status === 201) {
        showToast("success", response?.message || "Article saved");
        navigate("/articles", { state: { refresh: true } });
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

  const handleReset = () => {
    setForm({
      title: "",
      descriptionDelta: null,
      additionalDescription: "",
      category: "",
      subCategory: "",
      mediaType: "image",
      mediaFiles: [],
      questions: [""],
    });
    setPreviewImages([]);
    setExistingImages([]);
    if (quillInstance.current)
      quillInstance.current.setContents([{ insert: "\n" }]);
    setErrors({});
  };

  // Upload file and get URL
  const uploadArticlesMedia = async (file) => {
    try {
      const response = await FileControl.uploadFile({
        userId: articleId || "68be67fa873d8989943bbe80",
        docType: "media",
        files: file,
      });

      // Assuming response.data.url contains the uploaded file URL
      const fileUrl = response?.data?.url || response;
      setForm((prev) => ({
        ...prev,
        mediaFiles: [...prev.mediaFiles, fileUrl],
      }));
      previewImageFile(fileUrl);
    } catch (err) {
      showToast("error", "Failed to upload media");
    }
  };

  const previewImageFile = async (file) => {
    const filePath = await FileControl.previewFile(file);
    if (filePath) {
      setPreviewImages(filePath);
    }
  };

  const uploadArticlesThambnail = async (file) => {
    try {
      const response = await FileControl.uploadFile({
        userId: articleId || "68be67fa873d8989943bbe80",
        docType: "media",
        files: file,
      });

      // Assuming response.data.url contains the uploaded file URL
      if (response) {
        setForm((prev) => ({ ...prev, thumbnailURL: response }));
      }
      previewThambnailFile(response);
    } catch (err) {
      showToast("error", "Failed to upload media");
    }
  };

  const previewThambnailFile = async (file) => {
    const filePath = await FileControl.previewFile(file);
    if (filePath) {
      setExistingImages(filePath);
    }
  };

  const showFileInput =
    existingImages.length === 0 && previewImages.length === 0;

  return (
    <div className="main-form">
      <div className="form-header">
        <h5>{articleId ? "Edit Content" : "Add Content"}</h5>
        <button onClick={() => navigate("/articles")} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Category + Subcategory */}
        <div className="form-row mb-3" style={{ display: "flex", gap: "20px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>
              Category<span className="required">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              disabled={loadingCategories}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error">{errors.category}</span>
            )}
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>
              Subcategory<span className="required">*</span>
            </label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              disabled={loadingSubCategories}
            >
              <option value="">-- Select Subcategory --</option>
              {subCategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subCategory && (
              <span className="error">{errors.subCategory}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Title<span className="required">*</span>
            </label>
            <input name="title" value={form.title} onChange={handleChange} />
            {errors.title && <span className="error">{errors.title}</span>}
          </div>
        </div>

        {/* Description */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Description<span className="required">*</span>
            </label>
            <div ref={descriptionRef} style={{ height: "350px" }} />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="form-row mb-3">
          <label>
            Questions<span className="required">*</span>
          </label>
          {form.questions.map((q, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <input
                type="text"
                value={q}
                placeholder={`Enter question ${index + 1}`}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "14px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                style={{
                  background: "#e74c3c",
                  border: "none",
                  color: "white",
                  padding: "10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                title="Remove Question"
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            style={{
              background: "#3498db",
              color: "white",
              border: "none",
              padding: "10px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              marginTop: "5px",
            }}
          >
            <FaPlus /> Add Question
          </button>
          {errors.questions && (
            <span
              className="error"
              style={{ display: "block", marginTop: "5px" }}
            >
              {errors.questions}
            </span>
          )}
        </div>

        {/* Media Type */}
        <div className="form-row mb-3">
          <div className="form-group">
            <label>
              Media Type<span className="required">*</span>
            </label>
            {showFileInput ? (
              <select
                name="mediaType"
                value={form.mediaType}
                onChange={handleChange}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            ) : (
              <div style={{ marginBottom: "10px", color: "#666" }}>
                <strong>
                  {form.mediaType === "image" ? "Image" : "Video"}
                </strong>
              </div>
            )}
            {errors.mediaType && (
              <span className="error">{errors.mediaType}</span>
            )}
          </div>
        </div>

        {/* Media Files & Thumbnail */}
        <div className="form-row mb-3" style={{ display: "flex", gap: "20px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>
              Media Files<span className="required">*</span>
            </label>
            <input
              type="file"
              name="mediaFiles"
              multiple
              accept={form.mediaType === "image" ? "image/*" : "video/*"}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreviewImages(URL.createObjectURL(file)); // show instant preview
                  uploadArticlesMedia(file);
                }
              }}
            />
            {errors.mediaFiles && (
              <span className="error">{errors.mediaFiles}</span>
            )}

            <div
              className="preview-images"
              style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
            >
              <div
                className="preview-images mt-3"
                style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
              >
                {/* {previewImages && typeof existingImages === "string" && form.mediaType === "image" ? (
                  <img
                    src={previewImages}
                    alt="Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                ) : (
                  <video
                    src={previewImages}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                    controls
                  />
                )} */}

                <div
                  className="preview-images mt-3"
                  style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
                >
                  {/* IMAGE PREVIEW */}
                  {previewImages && typeof previewImages === "string" && form.mediaType === "image" && (
                    <img
                      src={previewImages}
                      alt="Preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                    />
                  )}

                  {/* VIDEO PREVIEW */}
                  {previewImages && typeof previewImages === "string" && form.mediaType === "video" && (
                    <video
                      src={previewImages}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                      }}
                      controls
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label>Thumbnail</label>
            <input
              type="file"
              name="thumbnailURL"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setExistingImages(URL.createObjectURL(file));
                  uploadArticlesThambnail(file);
                }
              }}
            />
            <div className="preview-thambnail mt-3">
              {existingImages && typeof existingImages === "string" ? (
                <img
                  src={existingImages}
                  alt="Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              ) : (
                ""
              )}
            </div>
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
            disabled={
              loadingCategories || loadingSubCategories || loadingArticle
            }
          >
            {loadingArticle ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
