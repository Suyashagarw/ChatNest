// @ts-check
import moment from "moment";
import React from "react";
import ClockIcon from "./ClockIcon";

const ReceiverMessage = ({
  username = "user",
  message = "Lorem ipsum dolor...",
  date,
}) => {
  // Check if the message starts with 'http' or 'https'
  const isLink = message.startsWith("http://") || message.startsWith("https://");
  console.log(isLink)

  return (
    <div className="d-flex">
      <div style={{ flex: 1 }} />
      <div style={{ width: "50%" }} className="text-right mb-4">
        <div
          className="conversation-list d-inline-block bg-light px-3 py-2"
          style={{ borderRadius: 12 }}
        >
          <div className="ctext-wrap">
            <div
              className="conversation-name text-left text-primary mb-1"
              style={{
                fontWeight: 600,
              }}
            >
              {username}
            </div>
            {isLink ? (
              <a href={message} target="_blank" rel="noopener noreferrer" className="text-left">
                {message}
              </a>
            ) : (
              <p className="text-left">{message}</p>
            )}
            <p className="chat-time mb-0">
              <ClockIcon /> {moment.unix(date).format("LT")}{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiverMessage;
