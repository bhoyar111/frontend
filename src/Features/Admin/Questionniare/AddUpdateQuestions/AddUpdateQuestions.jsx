import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import "./AddUpdateQuestions.css";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";

const QUESTION_FOR_OPTIONS = ["ICC", "NPS", "CSAT"];
const ANSWER_TYPES = [
  { label: "Dropdown", value: "dropdown" },
  { label: "Text", value: "text" },
];

const AddUpdateQuestions = ({ initialData = null, onSave }) => {
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const [form, setForm] = useState({
    questionFor: "",
    answerType: "",
    question: "",
    options: [""],
  });

  useEffect(() => {
    if (_id) {
      getQuestionDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);

  const getQuestionDetails = async () => {
    try {
      let reqData = {
        id: _id,
      };
      const response = await Service.getByIdQuestions(reqData);
      if (response?.status === 200 && response?.data) {
        const question = response.data;
        setForm({
          question: question.question || "",
          questionFor: question.questionFor || "",
          answerType: question.type || "",
          options: question.options?.map((opt) => opt.option) || [""],
        });
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        orderNo: initialData.orderNo || "",
        options: initialData.options.length ? initialData.options : [""],
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    // Reset options if answerType is changed to dropdown or radio
    if (field === "answerType") {
      const newOptions = value === "dropdown" ? [""] : [];
      setForm((prev) => ({
        ...prev,
        [field]: value,
        options: newOptions, // reset or clear options
      }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index] = value;
    setForm((prev) => ({ ...prev, options: updated }));
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    const updated = [...form.options];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, options: updated }));
  };

  const validate = () => {
    const errs = {};
    if (!form.questionFor) errs.questionFor = "Field is required";
    if (!form.answerType) errs.answerType = "Field is required";
    if (!form.question) errs.question = "Field is required";
    if (form.answerType === "dropdown" || form.answerType === "radio") {
      const nonEmptyOptions = form.options.filter((opt) => opt.trim() !== "");
      if (nonEmptyOptions.length === 0) {
        errs.options = "At least one option is required";
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    const trimmedOptions =
      form.answerType === "text"
        ? []
        : form.options
            .filter((opt) => opt.trim() !== "")
            .map((opt) => ({ option: opt.trim() }));
    const payload = {
      question: form.question,
      questionFor: form.questionFor,
      type: form.answerType,
      options: trimmedOptions,
    };
    // If it's an update, include questionId in payload
    if (_id) {
      payload.questionId = _id;
    }
    try {
      const response = _id
        ? await Service.updateQuestions(payload)
        : await Service.addNewQuestions(payload);
      if (response?.status === 200) {
        showToast("success", response?.message);
        onSave?.();
        navigate("/questionnaire", { state: { refresh: true } });
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };
  const isOptionType = form.answerType === "dropdown" || form.answerType === "";
  const handleCancel = () => {
    navigate("/questionnaire");
  };

   const goBack = () => navigate(-1);

  return (
    <div className="question-form">
      <div className="form-header mb-4">
        <h5>{"Add Survey Question"}</h5>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>
            Question For<span className="required">*</span>
          </label>
          <select
            value={form.questionFor}
            onChange={(e) => handleChange("questionFor", e.target.value)}
          >
            <option value="">Select</option>
            {QUESTION_FOR_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {errors.questionFor && (
            <span className="error">{errors.questionFor}</span>
          )}
        </div>

        <div className="form-group">
          <label>
            Answer Type<span className="required">*</span>
          </label>
          <select
            value={form.answerType}
            onChange={(e) => handleChange("answerType", e.target.value)}
          >
            <option value="">Select</option>
            {ANSWER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.answerType && (
            <span className="error">{errors.answerType}</span>
          )}
        </div>
      </div>
      <div className="form-group full-width">
        <label>
          Question<span className="required">*</span>
        </label>
        <textarea
          value={form.question}
          onChange={(e) => handleChange("question", e.target.value)}
        />
        {errors.question && <span className="error">{errors.question}</span>}
      </div>

      {isOptionType && (
        <div className="options-section">
          {form.options.map((opt, index) => (
            <div key={index} className="option-row">
              <input
                placeholder="Option"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="remove-btn"
              >
                -
              </button>
              {index === form.options.length - 1 && (
                <button type="button" onClick={addOption} className="add-btn">
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="form-actions">
        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddUpdateQuestions;
