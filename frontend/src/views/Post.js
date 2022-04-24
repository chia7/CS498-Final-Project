import React, { forwardRef } from "react";
import "./Post.css";
import { Avatar } from "@material-ui/core";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatIcon from "@material-ui/icons/Repeat";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishIcon from "@material-ui/icons/Publish";

// const Post = forwardRef(
//   ({ displayName, username, verified, text, image, avatar }, ref) => {
//     return (
//       <div className="post" ref={ref}>
//         <div className="post__avatar">
//           <Avatar src={avatar} />
//         </div>
//         <div className="post__body">
//           <div className="post__header">
//             <div className="post__headerText">
//               <h3>
//                 {displayName}{" "}
//                 <span className="post__headerSpecial">
//                   {verified && <VerifiedUserIcon className="post__badge" />} @
//                   {username}
//                 </span>
//               </h3>
//             </div>
//             <div className="post__headerDescription">
//               <p>{text}</p>
//             </div>
//           </div>
//           <img src={image} alt="" />
//           <div className="post__footer">
//             <ChatBubbleOutlineIcon fontSize="small" />
//             <RepeatIcon fontSize="small" />
//             <FavoriteBorderIcon fontSize="small" />
//             <PublishIcon fontSize="small" />
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

const Post = forwardRef(
  (
    {
      displayName,
      username,
      verified,
      text,
      userid,
      tweetid,
      time,
      image,
      avatar,
    },
    ref
  ) => {
    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          <Avatar src={avatar} />
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3 style={{ color: "black" }}>
                {displayName}{" "}
                <span className="post__headerSpecial">
                  {verified && <VerifiedUserIcon className="post__badge" />} @
                  {username}
                </span>
              </h3>
            </div>
            <div className="post__headerDescription">
              <p style={{ color: "black" }}>Tweet Content is: {text}</p>
              <p style={{ color: "black" }}>User ID is: {userid}</p>
              <p style={{ color: "black" }}>Tweet ID is: {tweetid}</p>
              <p style={{ color: "black" }}>Timestamp is: {time}</p>
            </div>
          </div>
          <img src={image} alt="" />
          <div className="post__footer">
            <ChatBubbleOutlineIcon fontSize="small" />
            <RepeatIcon fontSize="small" />
            <FavoriteBorderIcon fontSize="small" />
            <PublishIcon fontSize="small" />
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
