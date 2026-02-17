import api from "../../shared/api/axios";

export const createAnalysis = (data) => {
  return api.post("analyze/", data);
};

export const getAnalysisResult = (taskId) => {
  return api.get(`analyze/${taskId}/`);
};

export const getMyAnalyses = () => {
  return api.get("my-analyses/");
};
