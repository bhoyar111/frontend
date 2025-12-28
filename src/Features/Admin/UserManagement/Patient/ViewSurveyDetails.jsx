import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Patient.css";
import Service from "../Services";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import { FaArrowLeft } from "react-icons/fa";

export default function ViewSurveyDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch both user and questionnaire data
  useEffect(() => {
    if (userId) {
      fetchPatientAssessment(userId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Fetch patient survey assessment
  const fetchPatientAssessment = async () => {
    try {
      const reqData = {
        patientId: userId,
      };
       const res = await Service.getViewSurveyDetails(reqData);       
      if (res?.status === 200 ) {
        setAssessments(res.data.result || []);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch assessments"
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate(-1);

  if (!assessments || loading)
    return <div className="profile-wrapper">Loading...</div>;

  return (
    <div className="profile-wrapper-test">
      {/* Header */}
      <div className="form-header mb-4">
        <h5><b>Patient Survey Details</b></h5>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      {/* Survey Assessment Section */}
      <div className="survey-section">
        <div className="survey-header">
          <h5>Patient Survey Responses</h5>
        </div>

        {assessments.length === 0 ? (
          <p className="no-data">No assessments found.</p>
        ) : (
          assessments.map((item, index) => (
            <div key={item._id} className="assessment-card">
              {/* <h6 className="submission-title">Submission</h6> */}

              <div className="qa-list">
                {item.assessments.map((qa, i) => (
                  <div key={qa._id} className="qa-item">
                    <p className="question">
                      {i + 1}. {qa.question}
                    </p>
                    <p className="answer">
                      <strong>Answer:</strong> {qa.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Meta section moved to bottom */}
              <div className="assessment-meta">
                {item.comments && (
                  <p>
                    <b>Comments:</b> {item.comments}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
