import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/services/projects/projectsService";
import { IProject } from "@/types/types";

/**
 * Fetch all projects from the API
 * @returns Query object containing projects data, loading and error states
 */
const useGetProjects = () => {
  return useQuery<IProject[], Error>({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache persists for 30 minutes
  });
};

export default useGetProjects;
