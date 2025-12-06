import { GROUP_CHAT_ROUTES } from "@/constants/routes";
import { AxiosError } from "axios";
import api from "./axiosInstance";

const handleRequest = async <T>(request: Promise<{ data: T }>, errorMessage?: string): Promise<T> => {
    try {
        const response = await request;
        return response.data;
    } catch (err) {
        if (err instanceof AxiosError) {
            throw err.response?.data || new Error(errorMessage || "Network error");
        }
        throw new Error(errorMessage || "Network error");
    }
};

export const createGroup = (data: { name: string; members: string[] }) =>
    handleRequest(api.post(GROUP_CHAT_ROUTES.CREATE_GROUP, data));

export const sendGroupMessage = (data: { groupId: string; message: string; senderName?: string }, file?: File) => {
    if (file) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('groupId', data.groupId);
        formData.append('message', data.message || '');
        if (data.senderName) {
            formData.append('senderName', data.senderName);
        }
        formData.append('file', file);

        return handleRequest(api.post(GROUP_CHAT_ROUTES.SEND_MESSAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }));
    }

    // Text-only message
    return handleRequest(api.post(GROUP_CHAT_ROUTES.SEND_MESSAGE, data));
};

export const getGroupMessages = (groupId: string, limit?: number, after?: string) =>
    handleRequest(
        api.get(GROUP_CHAT_ROUTES.GET_MESSAGES(groupId), {
            params: { limit, after },
        })
    );

export const getMyGroups = () =>
    handleRequest(api.get(GROUP_CHAT_ROUTES.MY_GROUPS));

export const addMemberToGroup = (groupId: string, data: { newMemberId: string; newMemberName: string }) =>
    handleRequest(api.post(GROUP_CHAT_ROUTES.ADD_MEMBER(groupId), data));

export const removeMemberFromGroup = (groupId: string, memberId: string, data: { memberName: string }) =>
    handleRequest(api.delete(GROUP_CHAT_ROUTES.REMOVE_MEMBER(groupId, memberId), { data }));

export const getDepartmentGroups = () =>
    handleRequest(api.get(GROUP_CHAT_ROUTES.DEPARTMENT_GROUPS));

export const getMyDepartmentGroup = () =>
    handleRequest(api.get(GROUP_CHAT_ROUTES.MY_DEPARTMENT_GROUP));
