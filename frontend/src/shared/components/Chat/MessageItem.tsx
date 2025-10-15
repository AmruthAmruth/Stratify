import React from "react";

interface Props {
  content: string;
  isMine: boolean;
}

export const MessageItem: React.FC<Props> = ({ content, isMine }) => (
  <div className={`message ${isMine ? "mine" : "theirs"}`}>
    {content}
  </div>
);