export const getHeaders = () => {
    let token = null;
    let email = "demo@nexuspay.com";

    try {
        if (typeof window !== "undefined" && window.localStorage) {
            token = localStorage.getItem("token");
            email = localStorage.getItem("userEmail") || email;
        }
    } catch (e) {
        // Silently ignore localStorage errors during SSR/Build
    }

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    headers["X-User-Email"] = email;

    return headers;
};
