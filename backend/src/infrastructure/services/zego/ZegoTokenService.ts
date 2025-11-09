
import { generateToken04 } from "./tokenGenerator/token04";

export class ZegoTokenService {
  constructor(
    private readonly appId: number,
    private readonly serverSecret: string
  ) {}

  generate(roomId: string, userId: string, _userName: string): string {
    const effectiveTimeInSeconds = 3600;

    const payload = JSON.stringify({
      room_id: roomId,
      privilege: {
        1: 1, 
        2: 1, 
      },
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
