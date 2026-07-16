import { ICloseMeetingUseCase } from "../../application/interfaces/meeting/ICloseMeetingUseCase";
import { ICreateMeetingUseCase } from "../../application/interfaces/meeting/ICreateMeetingUseCase";
import { IGenerateMeetingTokenUseCase } from "../../application/interfaces/meeting/IGenerateMeetingTokenUseCase";
import { IGetMeetingsForEmployeeUseCase } from "../../application/interfaces/meeting/IGetMeetingForEmployeeUseCase";
import { IGetMeetingsByCreatorUseCase } from "../../application/interfaces/meeting/IGetMeetingsByCreatorUseCase";
import { IJoinMeetingUseCase } from "../../application/interfaces/meeting/IJoinMeetingUseCase";
import { StatusCodes } from "../../shared/constants/statusCodes";
import { Messages } from "../../shared/constants/messages";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { Response, Request } from "express";


export class MeetingController {
  constructor(
    private _createMeetingUseCase: ICreateMeetingUseCase,
    private _generateMeetingTokenUseCase: IGenerateMeetingTokenUseCase,
    private _joinMeetingUseCase: IJoinMeetingUseCase,
    private _closeMeetingUseCase: ICloseMeetingUseCase,
    private _getMeetingsByCreatorUseCase: IGetMeetingsByCreatorUseCase,
    private _getMeetingForEmployeeUseCase: IGetMeetingsForEmployeeUseCase
  ) { }

  createMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const { title } = req.body
    const response = await this._createMeetingUseCase.execute(userId!, title);
    res.status(StatusCodes.OK).json({ message: Messages.MEETING_CREATED, response })
  }

  genarateToken = async (req: AuthRequest, res: Response): Promise<void> => {
    const { roomId, userName } = req.body;
    const userId = req.userId;
    const token = await this._generateMeetingTokenUseCase.execute(roomId, userId!, userName)
    res.status(StatusCodes.CREATED).json({ message: Messages.TOKEN_GENERATED, token })
  }

  joinMeeting = async (req: AuthRequest, res: Response): Promise<void> => {
    const roomId = req.params.roomId as string;
    const userId = req.userId; 
    const meeting = await this._joinMeetingUseCase.execute(roomId, userId!);
    res.status(StatusCodes.OK).json(meeting)
  }

  closeMeeting = async (req: Request, res: Response): Promise<void> => {
    const roomId = req.params.roomId as string;
    await this._closeMeetingUseCase.execute(roomId);
    res.status(StatusCodes.OK).json({ message: Messages.MEETING_CLOSED })
  }


  getMeetingsByCreator = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const response = await this._getMeetingsByCreatorUseCase.execute(userId!);
    res.status(StatusCodes.OK).json(response)
  }

  getMeetingForEmployee = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const response = await this._getMeetingForEmployeeUseCase.execute(userId!)
    res.status(StatusCodes.OK).json(response)
  }


}