import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallProps {
  roomId: string;
  userName: string;
  token: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, userName, token }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      console.error("Invalid Zego token:", token);
      return;
    }

    // 1. Create Zego instance
    const zp = ZegoUIKitPrebuilt.create(token);

    // 2. Join room
    zp.joinRoom({
      container: containerRef.current!,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${window.location.origin}/meeting/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall, // Supports multiple participants
      },
      showScreenSharingButton: true,
      showPreJoinView: false,
      userName,
    });

    return () => {
      // Optional: leave room on unmount
      zp.destroy();
    };
  }, [roomId, userName, token]);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default VideoCall;
