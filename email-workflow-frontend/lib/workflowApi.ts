import api from "./axios";



export const createWorkflow = (data: any) => {

    return api.post("/workflow", data);

};

export const getWorkflows = () => {

    return api.get("/workflow");

};

export const triggerWorkflow = (id: any) => {

    return api.post(`/workflow/${id}/run`);

};

export const deleteWorkflow = (id: string) => {

    return api.delete(`/workflow/${id}`);

};

export const updateWorkflow = (id: string, data: any) => {

    return api.put(`/workflow/${id}`, data);

};

export const getConnectedEmail = () => {
    return api.get(`/settings/email`)
}