import React from "react";
import "./SidebarOption.css";

// function SidebarOption({ active, text, Icon }) {
//   return (
//     <div className={`sidebarOption ${active && "sidebarOption--active"}`}>
//       <Icon />
//       <h5 style={{ color: "black" }}>{text}</h5>
//     </div>
//   );
// }

function SidebarOption({ active, text }) {
  return (
    <div className={`sidebarOption ${active && "sidebarOption--active"}`}>
      {/* <Icon /> */}
      <h5 style={{ color: "black" }}>{text}</h5>
    </div>
  );
}

export default SidebarOption;
