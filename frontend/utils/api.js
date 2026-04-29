export const getHeaders = () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail") || "demo@nexuspay.com";

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    // Keeping this for backward compatibility if backend still expects it in some places
    headers["X-User-Email"] = email;

    return headers;
};
