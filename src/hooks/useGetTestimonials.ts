import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "@/services/testimonials/testimonialsService";
import { ITestimonial } from "@/types/types";

/**
 * Fetch all testimonials from the API
 * @returns Query object containing testimonials data, loading and error states
 */
const useGetTestimonials = () => {
  return useQuery<ITestimonial[], Error>({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache persists for 30 minutes
  });
};

export default useGetTestimonials;
