import { api } from "@/lib";

/**
 * Get all testimonials
 * @returns - A promise that resolves to the testimonials data
 */
const getTestimonials = async () => {
  try {
    const response = await api.get("/testimonials");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getTestimonials };
