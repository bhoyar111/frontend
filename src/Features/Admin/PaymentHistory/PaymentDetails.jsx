import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate, Link } from "react-router-dom";

const PaymentDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const transaction = location.state?.transaction;

  const services = transaction?.subscription?.planDetails?.services || [];
  const text = services.join(", ");
  const isLong = text.length > 20;

  const goBack = () => {
    navigate(-1);
  };

  if (!transaction) {
    return <p>No transaction details found.</p>;
  }

  return (
    <div className="profile-wrapper-test">
      <div className="form-header mb-4">
        <h5>
          Subscription Details:
          <Link
            to={`/patients/view-patient/${transaction?.user?._id}`}
            className="fw-semibold text-decoration-none"
          >
            {transaction?.user?.fullName || "-"}
          </Link>
        </h5>
        <button onClick={goBack} className="back-button">
          <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
          Back
        </button>
      </div>

      <div className="profile-details">
        <div className="profile-details-grid" style={{ borderBottom: "none" }}>
          <div>
            <label>Plan Name</label>
            {transaction?.subscription?.planDetails?.planName || "-"}
          </div>

          <div>
            <label>Services</label>{" "}
            {services.length === 0
              ? "—"
              : expanded || !isLong
                ? text
                : text.slice(0, 20) + "... "}
            {isLong && (
              <span
                onClick={() => setExpanded(!expanded)}
                style={{ color: "blue", cursor: "pointer" }}
              >
                {expanded ? "View Less" : "View More"}
              </span>
            )}
          </div>

          <div>
            <label>Plan Duration</label>
            {transaction?.subscription?.planDetails?.planDuration || "-"}
          </div>

          <div>
            <label>Plan Price($)</label>
            {transaction?.subscription?.planDetails?.planPrice || "-"}
          </div>

          <div>
            <label>Discount(%)</label>
            {transaction?.subscription?.planDetails?.discountPercentage || "-"}
          </div>

          <div>
            <label>Amount Paid($)</label>
            {transaction?.subscription?.planDetails?.amountPaid || "-"}
          </div>

          <div>
            <label>Subscription Status</label>
            {transaction?.subscription?.subscriptionStatus || "-"}
          </div>

          <div>
            <label>Currency</label>
            {transaction?.currency ? transaction.currency.toUpperCase() : "-"}
          </div>

          <div>
            <label>Purchase Date</label>
            {transaction?.subscription?.purchaseDate
              ? new Date(
                  transaction.subscription.purchaseDate
                ).toLocaleDateString("en-GB")
              : "-"}
          </div>

          <div>
            <label>End Date</label>
            {transaction?.endDate
              ? new Date(transaction.endDate).toLocaleDateString("en-GB")
              : "-"}
          </div>

          <div>
            <label>Transaction Id</label>
            {transaction?.transactionId || "-"}
          </div>

          <div>
            <label>Payment Mode</label>
            {transaction?.paymentMode || "-"}
          </div>

          <div>
            <label>Payment Type</label>
            {transaction?.paymentType || "-"}
          </div>

          <div>
            <label>Transaction Status</label>
            {transaction?.status || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
