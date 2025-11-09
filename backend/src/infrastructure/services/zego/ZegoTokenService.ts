// infrastructure/services/zego/ZegoTokenService.ts
import { generateToken04 } from "./tokenGenerator/token04";

export class ZegoTokenService {
  constructor(
    private readonly appId: number,
    private readonly serverSecret: string
  ) {}

  generate(roomId: string, userId: string, userName: string): string {
    const effectiveTimeInSeconds = 3600; // 1 hour

    const payload = JSON.stringify({
      room_id: roomId,
      privilege: {
        1: 1, // Login privilege
        2: 1, // Publish privilege
      },
      user_name: userName,
    });

    return generateToken04(
      this.appId,
      userId,
      this.serverSecret,
      effectiveTimeInSeconds,
      payload
    );
  }
}
