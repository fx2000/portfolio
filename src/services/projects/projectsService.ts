import { api } from "@/lib";

/**
 * Get all projects
 * @returns - A promise that resolves to the projects data
 */
const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getProjects };
