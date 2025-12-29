import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export function useApi() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const apiFetch = async (url: string, options: RequestInit = {}) => {
        const token = localStorage.getItem("access_token");
    
        var headers: HeadersInit = {};
        if (options.body && !(options.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
            
        const res = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                ...headers,
                ...options.headers,
            },
        });

        if (res.status === 401) {
            logout();
            navigate("/login");
            throw new Error("Session expired. Please log in again.");
        }

        if (!res.ok) {
            const err = await res.text();
            throw new Error(`API request failed with status ${res.status} ${err}`);
        }

        return res.json();
    }

    return { apiFetch };
}