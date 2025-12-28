import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./AddUpdate.css";
import Service from "../Services";
import showToast from "../../../../Common/Shared/Utils/ToastNotification";

const AddUpdate = ({ initialData = null, onSave }) => {
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const [form, setForm] = useState({
    questionId:'',
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
    if (!form.question) errs.question = "Field is required";
   
      const nonEmptyOptions = form.options.filter((opt) => opt.trim() !== "");
      if (nonEmptyOptions.length === 0) {
        errs.options = "At least one option is required";
      }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async () => {
    if (!validate()) return;
    const trimmedOptions =
    form.options
            .filter((opt) => opt.trim() !== "")
            .map((opt) => ({ option: opt.trim() }));
    const payload = {
      question: form.question,
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
        navigate("/on-board-question", { state: { refresh: true } });
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };
  const isOptionType = form.answerType === "dropdown" || form.answerType === "";
  const handleCancel = () => {
    navigate("/on-board-question");
  };

  const goBack = () => navigate(-1);

  return (
    <div className="question-form">
      <div className="form-header mb-4">
        <h5>{"Add On-board Question"}</h5>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
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

export default AddUpdate;
