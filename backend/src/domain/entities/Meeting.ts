export class Meeting{
    constructor(
            public readonly id:string | undefined,
            public readonly roomId:string,
            public readonly creatorId:string,
            public readonly title:string,
            public readonly status:'open'|'closed',
            public  readonly createdAt:Date
    ){}
}