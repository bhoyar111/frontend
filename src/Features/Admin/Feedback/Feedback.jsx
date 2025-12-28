import React, { useState } from "react";
import "./Feedback.css";

const FeedBack = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 5,
      review:
        "Dr. Johnson was extremely professional and took the time to explain everything thoroughly. I felt completely at ease during my appointment.",
      patient: "John D.",
      time: "2 days ago"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurologist",
      rating: 4,
      review:
        "The doctor was knowledgeable but the wait time was longer than expected. The treatment plan was effective though.",
      patient: "Emma S.",
      time: "1 week ago"
    },
    {
      name: "Dr. Robert Taylor",
      specialty: "Pediatrician",
      rating: 5,
      review:
        "My child was very comfortable with Dr. Taylor. He has a great bedside manner and explains things in a way that kids can understand.",
      patient: "Lisa M.",
      time: "3 days ago"
    },
    {
      name: "Dr. Amanda Lee",
      specialty: "Dermatologist",
      rating: 2,
      review:
        "I was disappointed with my visit. The doctor seemed rushed and didn’t address all my concerns. The treatment didn’t help my condition.",
      patient: "David K.",
      time: "2 weeks ago"
    },
    {
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgeon",
      rating: 5,
      review:
        "Outstanding care! Dr. Wilson performed my knee surgery and the results have been amazing. His entire team was professional and caring throughout the process.",
      patient: "Thomas R.",
      time: "1 month ago"
    },
    {
      name: "Dr. Olivia Martinez",
      specialty: "General Practitioner",
      rating: 5,
      review:
        "Dr. Martinez is the best doctor I’ve ever had. She listens carefully, answers all questions, and truly cares about her patients.",
      patient: "Sophia B.",
      time: "5 days ago"
    }
  ];

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reviews-container">
      <h2>Doctor Reviews</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search doctor by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="reviews-grid">
        {filteredDoctors.map((doc, index) => (
          <div className="review-card" key={index}>
            <h3>{doc.name}</h3>
            <p className="specialty">{doc.specialty}</p>
            <div className="stars">
              {"⭐".repeat(doc.rating)}
              {"☆".repeat(5 - doc.rating)}
            </div>
            <p className="review-text">&quot;{doc.review}&quot;</p>
            <div className="review-footer">
              <span className="patient">{doc.patient}</span>
              <span className="time">{doc.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="pagination">
        <button>{"<"}</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>{">"}</button>
      </div>
    </div>
  );
};

export default FeedBack;
