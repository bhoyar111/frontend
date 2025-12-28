import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userlogout } from "../../Slice/AuthSlice";
import { toast } from "react-toastify";
const IdleSystem = ({ timeout = 15 * 60 * 1000 }) => {
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleLogout();
    }, timeout);
  };

  const handleLogout = () => {
    dispatch(userlogout());
    toast.info("You were logged out due to inactivity.", {
      position: "top-center",
      autoClose: 3000
    });

    navigate("/admin-login");
  };

  useEffect(() => {
    const events = [
      "mousemove",
      "mousedown",
      "keypress",
      "scroll",
      "touchstart"
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
};

export default IdleSystem;
