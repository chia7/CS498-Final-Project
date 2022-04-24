import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App2.css";

function App2() {
  return (
    // BEM
    <div
      style={{
        backgroundColor: "white",
      }}
      className="app2"
    >
      <Sidebar />
      <Feed />
      {/* <Widgets /> */}
    </div>
  );
}

export default App2;
