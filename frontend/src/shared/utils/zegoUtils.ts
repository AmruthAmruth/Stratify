export const initializeZegoCall = (
  containerId: string,
  roomId: string,
  zegoToken: string,
  userName: string,
  userId: string,
  onLeave: () => void
) => {
  if (!window.ZegoUIKitPrebuilt) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js';
    script.onload = () => setupZego();
    document.head.appendChild(script);
  } else {
    setupZego();
  }

  function setupZego() {
    const zp = window.ZegoUIKitPrebuilt.create(zegoToken);
    zp.joinRoom({
      container: document.getElementById(containerId),
      scenario: {
        mode: window.ZegoUIKitPrebuilt.VideoConference,
      },
      showScreenSharingButton: true,
      showPreJoinView: false,
      showRoomTimer: true,
      maxUsers: 50,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: true,
      showLeavingView: false,
      onLeaveRoom: () => {
        if (onLeave) onLeave();
      },
    });
  }
};
