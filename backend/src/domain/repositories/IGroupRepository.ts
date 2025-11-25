import { Group } from "../entities/Group";

export interface IGroupRepository {
  create(name: string, members: string[]): Promise<Group>;
  findById(groupId: string): Promise<Group | null>;
  addMember(groupId: string, userId: string): Promise<Group | null>;
  removeMember(groupId: string, userId: string): Promise<Group | null>;
  getGroupsForUser(userId: string): Promise<Group[]>;
}