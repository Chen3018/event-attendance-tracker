const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
    const token = localStorage.getItem("access_token");

    const res = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`API request failed with status ${res.status} ${err}`);
    }

    return res.json();
}