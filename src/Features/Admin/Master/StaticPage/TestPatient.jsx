import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
import OT from "@opentok/client";
import "./TestPatient.css";
import CallPopup from "../../../Provider/Communication/CallPopup";
// import { socketUrl } from "../../../../Config/Environment";
import Service from "../../../Provider/Service/Services";

// const socket = io(`${socketUrl}`);
const socket = "";

export default function TestPatient() {
  const providerId = "689dcaadb59dbd0716adf508";
  const patientId = "68625279caf0f21945049413";

  const [incomingCall, setIncomingCall] = useState(false);
  const [status, setStatus] = useState("");
  const [callData, setCallData] = useState(null); // store sessionData from provider
  // console.log(callData, "callData");

  useEffect(() => {
  socket.emit("register", patientId);

  socket.on("incoming-call", ({ sessionData }) => {
    setCallData(sessionData);
    setIncomingCall(true);
    setStatus("");
  });

  socket.on("call-cancelled", () => {
    setIncomingCall(false);
    setCallData(null);
    setStatus("Call cancelled by provider.");
  });

   // Listen for provider ending call
  socket.on("end-call", () => {
    setIncomingCall(false);
    setCallData(null);
    setStatus("Provider ended the call.");
    // Also disconnect OpenTok session if active
    if (window.patientSession) {
      window.patientSession.disconnect();
      window.patientSession = null;
    }
  });

  return () => {
    socket.off("incoming-call");
    socket.off("call-cancelled");
    socket.off("call-accepted");
    socket.off("end-call");
  };
}, []);


  const acceptCall = async () => {
    if (!callData) return;

    setIncomingCall(false);

    // Send sessionId back with accept call so backend can generate token for provider
    socket.emit("accept-call", {
      patientId,
      providerId,
      sessionId: callData.sessionId
    });

    // Save Call History (accept)
    await Service.manageVideoCallHistory({
      sessionId: callData.sessionId,
      providerId,
      patientId,
      action: "accept"
    });

    startVideoCall(callData); // start video call with sessionData received from provider
  };

  const declineCall = async () => {
    setIncomingCall(false);
    setCallData(null);
    socket.emit("decline-call", { patientId, providerId });

    // Save Call History (decline)
    await Service.manageVideoCallHistory({
      sessionId: callData?.sessionId,
      providerId,
      patientId,
      action: "decline"
    });

    setStatus("You declined the call.");
  };

  function startVideoCall({ applicationId, sessionId, token }) {
    const session = OT.initSession(applicationId, sessionId);
    window.patientSession = session;

    session.on("streamCreated", (event) => {
      session.subscribe(event.stream, "subscriber", {
        insertMode: "append",
        width: "400px",
        height: "400px"
      });
    });

    const publisher = OT.initPublisher("publisher", {
      insertMode: "append",
      width: "400px",
      height: "400px"
    });

    session.connect(token, (err) => {
      if (!err) {
        session.publish(publisher);
      } else {
        // console.error("Error connecting:", err);
      }
    });
  }

  return (
    <div className="test-patient">
      <h2>Patient Dashboard Testing</h2>
      {status && <p className="status-msg">{status}</p>}

      {incomingCall && (
      <CallPopup
        caller={{ name: "Dr. Adam Mark" }}
        onAccept={acceptCall}
        onDecline={declineCall}
        isOutgoing={false}
      />
    )}
      <div id="subscriber" className="video-box"></div>
      <div id="publisher" className="video-box"></div>
    </div>
  );
}
