import { Group } from "../entities/Group";

export interface IGroupRepository {
  create(name: string, members: string[]): Promise<Group>;
  findById(groupId: string): Promise<Group | null>;
  addMember(groupId: string, userId: string): Promise<Group | null>;
  removeMember(groupId: string, userId: string): Promise<Group | null>;
  getGroupsForUser(userId: string): Promise<Group[]>;
  findByDepartmentId(departmentId: string): Promise<Group | null>;
  createDepartmentGroup(name: string, members: string[], departmentId: string): Promise<Group>;
  updateMembers(groupId: string, members: string[]): Promise<Group | null>;
}