import React from "react";

import loaderIcon from "../../Assests/logo.png";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="backdrop">
      <div className="loader">
        <img src={loaderIcon} alt="Logo" className="logo" />
      </div>
    </div>
  );
};

export default Loader;
