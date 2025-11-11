import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface VideoCallProps {
  roomId: string;
  userName: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ roomId, userName }) => {
  const meetingContainer = useRef<HTMLDivElement>(null);
  const zpRef = useRef<any>(null); // ✅ Keep Zego instance for cleanup

  useEffect(() => {
    const appID = 1198444485;
    const serverSecret = "40792d228935dcb5e48c503f26f14099";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(), // unique userId
      userName
    );

    // ✅ Prevent duplicate join
    if (zpRef.current) return;
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: meetingContainer.current!,
      sharedLinks: [
        {
          name: "Join Link",
          url: `${window.location.origin}/join/${roomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });

    // ✅ Clean up properly when leaving
    return () => {
      try {
        zpRef.current?.destroy(); // cleanly close session
        zpRef.current = null;
      } catch (err) {
        console.warn("Cleanup error:", err);
      }
    };
  }, [roomId, userName]);

  return (
    <div
      ref={meetingContainer}
      style={{ width: "85vw", height: "90vh", backgroundColor: "#000" }}
    />
  );
};
