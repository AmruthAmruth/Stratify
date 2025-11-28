import { Group } from "../../domain/entities/Group";
import { IGroupRepository } from "../../domain/repositories/IGroupRepository";
import GroupModel from "../models/GroupModel";



export class GroupRepository implements IGroupRepository {
  async create(name: string, members: string[]): Promise<Group> {
    const doc = await GroupModel.create({ name, members });
    return new Group(doc.id.toString(), doc.name, doc.members, doc.createdAt, doc.updatedAt);
  }

  async findById(groupId: string): Promise<Group | null> {
    const doc = await GroupModel.findById(groupId).lean();
    if (!doc) return null;
    return new Group(doc._id.toString(), doc.name, doc.members, doc.createdAt, doc.updatedAt);
  }

  async addMember(groupId: string, userId: string): Promise<Group | null> {
    const doc = await GroupModel.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    ).lean();
    if (!doc) return null;
    return new Group(doc._id.toString(), doc.name, doc.members, doc.createdAt, doc.updatedAt);
  }

  async removeMember(groupId: string, userId: string): Promise<Group | null> {
    const doc = await GroupModel.findByIdAndUpdate(
      groupId,
      { $pull: { members: userId } },
      { new: true }
    ).lean();
    if (!doc) return null;
    return new Group(doc._id.toString(), doc.name, doc.members, doc.createdAt, doc.updatedAt);
  }

  async getGroupsForUser(userId: string): Promise<Group[]> {
    const docs = await GroupModel.find({ members: userId }).lean();
    return docs.map((d) => new Group(d._id.toString(), d.name, d.members, d.createdAt, d.updatedAt));
  }
}  