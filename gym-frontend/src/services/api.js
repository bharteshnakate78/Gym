import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8081/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(
      "API ERROR:",
      error.response?.status,
      error.response?.data ||
        error.message
    );

    return Promise.reject(error);
  }
);

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
  login: async (data) => {
    const response = await api.post(
      "/auth/login",
      data
    );

    return response.data;
  },

  register: async (data) => {
    const response = await api.post(
      "/auth/register",
      data
    );

    return response.data;
  },

  me: async () => {
    const response = await api.get(
      "/auth/me"
    );

    return response.data;
  },
};

// ============================================================
// MEMBERSHIP API
// ============================================================

export const membershipAPI = {
  getAll: async () => {
    const response = await api.get(
      "/memberships"
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/memberships/${id}`
    );

    return response.data;
  },
};

// ============================================================
// PAYMENT API
// ============================================================

export const paymentAPI = {
  // ----------------------------------------------------------
  // MEMBER - CREATE RAZORPAY ORDER
  // ----------------------------------------------------------

  createOrder: async (
    membershipPlanId
  ) => {
    const response = await api.post(
      "/payments/create-order",
      {
        membershipPlanId,
      }
    );

    return response.data;
  },

  // ----------------------------------------------------------
  // MEMBER - VERIFY PAYMENT
  // ----------------------------------------------------------

  verify: async (paymentData) => {
    const response = await api.post(
      "/payments/verify",
      paymentData
    );

    return response.data;
  },

  // ----------------------------------------------------------
  // MEMBER - MY PAYMENTS
  // ----------------------------------------------------------

  getMyPayments: async () => {
    const response = await api.get(
      "/payments/my"
    );

    return response.data;
  },

  // ----------------------------------------------------------
  // ADMIN - ALL PAYMENTS
  // ----------------------------------------------------------

  getAllPayments: async () => {
    const response = await api.get(
      "/payments"
    );

    return response.data;
  },

  // ----------------------------------------------------------
  // ADMIN - PAYMENT BY ID
  // ----------------------------------------------------------

  getById: async (paymentId) => {
    const response = await api.get(
      `/payments/${paymentId}`
    );

    return response.data;
  },

  // ----------------------------------------------------------
  // ADMIN - SUCCESSFUL PAYMENTS
  // ----------------------------------------------------------

  getSuccessfulPayments: async () => {
    const response = await api.get(
      "/payments/successful"
    );

    return response.data;
  },
};

// ============================================================
// USER API
// ============================================================

export const userAPI = {
  getProfile: async () => {
    const response = await api.get(
      "/users/profile"
    );

    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put(
      "/users/profile",
      data
    );

    return response.data;
  },
};

// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;

export { api };



// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ===============================
// // REQUEST INTERCEPTOR
// // ===============================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ===============================
// // RESPONSE INTERCEPTOR
// // ===============================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error(
//       "API Error:",
//       error.response?.data || error.message
//     );

//     return Promise.reject(error);
//   }
// );

// // ===============================
// // PAYMENT API
// // ===============================
// // export const paymentAPI = {
// //   createOrder: async (membershipPlanId) => {
// //     const response = await api.post(
// //       "/payments/create-order",
// //       {
// //         membershipPlanId,
// //       }
// //     );

// //     return response.data;
// //   },

// //   verify: async (paymentData) => {
// //     const response = await api.post(
// //       "/payments/verify",
// //       paymentData
// //     );

// //     return response.data;
// //   },

// //   getMyPayments: async () => {
// //     const response = await api.get("/payments/my");

// //     return response.data;
// //   },

// //   getAllPayments: async () => {
// //     const response = await api.get("/payments");

// //     return response.data;
// //   },

// //   getById: async (paymentId) => {
// //     const response = await api.get(
// //       `/payments/${paymentId}`
// //     );

// //     return response.data;
// //   },
// // };


// export const paymentAPI = {
//   createOrder: async (membershipPlanId) => {
//     const response = await api.post(
//       "/payments/create-order",
//       {
//         membershipPlanId,
//       }
//     );

//     return response.data;
//   },

//   verify: async (paymentData) => {
//     const response = await api.post(
//       "/payments/verify",
//       paymentData
//     );

//     return response.data;
//   },

//   getMyPayments: async () => {
//     const response = await api.get(
//       "/payments/my"
//     );

//     return response.data;
//   },

//   getAllPayments: async () => {
//     const response = await api.get(
//       "/payments"
//     );

//     return response.data;
//   },

//   getById: async (paymentId) => {
//     const response = await api.get(
//       `/payments/${paymentId}`
//     );

//     return response.data;
//   },

//   getSuccessfulPayments: async () => {
//     const response = await api.get(
//       "/payments/successful"
//     );

//     return response.data;
//   },
// };
// // ===============================
// // DEFAULT EXPORT
// // ===============================
// export default api;

// // Named export also available
// export { api };
