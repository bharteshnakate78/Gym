import api from "./api";

// GET ALL
export const getTestimonials = async () => {
  const response = await api.get("/testimonials");
  return response.data;
};

// GET ONE
export const getTestimonialById = async (id) => {
  const response = await api.get(`/testimonials/${id}`);
  return response.data;
};

// CREATE
export const createTestimonial = async (data) => {
  const response = await api.post("/testimonials", data);
  return response.data;
};

// UPDATE
export const updateTestimonial = async (id, data) => {
  const response = await api.put(
    `/testimonials/${id}`,
    data
  );

  return response.data;
};

// DELETE
export const deleteTestimonial = async (id) => {
  const response = await api.delete(
    `/testimonials/${id}`
  );

  return response.data;
};