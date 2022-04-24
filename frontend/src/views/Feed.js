import React, { useState } from "react";
import Post from "./Post";
import "./Feed.css";
import FlipMove from "react-flip-move";
import "./TweetBox.css";
import { Avatar, Button } from "@material-ui/core";

function Feed() {
  const [posts, setQ1] = useState([]);
  const [tweetMessage, setTweetMessage] = useState("");

  const sendTweet = (e) => {
    e.preventDefault();
    setTweetMessage(tweetMessage);
    fetchData1();
    // setTweetMessage("");
  };

  const fetchData1 = (mess) => {
    let url = "/q1?screen_name=" + tweetMessage;
    console.log(url);
    fetch(url).then((respnse) =>
      respnse.json().then((data) => {
        setQ1(data);
        console.log(data);
      })
    );
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h5 style={{ color: "black" }}>Home</h5>
      </div>
      <div className="tweetBox">
        <form>
          <div className="tweetBox__input">
            <Avatar src="https://cdn.vox-cdn.com/thumbor/hLFis2O0JRluI7k4JBaRjpKOErw=/0x0:1694x866/2120x1413/filters:focal(712x298:982x568):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/63097414/Screen_Shot_2019_02_22_at_3.13.37_PM.0.png" />
            <input
              onChange={(e) => setTweetMessage(e.target.value)}
              value={tweetMessage}
              placeholder="What's happening?"
              type="text"
            />
          </div>

          <Button
            onClick={sendTweet}
            type="submit"
            className="tweetBox__tweetButton"
          >
            Tweet
          </Button>
        </form>
      </div>

      <FlipMove>
        {posts.map((post) => (
          <Post
            key={post[0]}
            //
            displayName={post[0]}
            username={post[1]}
            verified={post[1]}
            text={post[2]}
            userid={post[1]}
            tweetid={post[3]}
            time={post[4]}
            //
            avatar={post[1]}
            image={post[1]}
          />
        ))}
      </FlipMove>
    </div>
  );
}

export default Feed;
