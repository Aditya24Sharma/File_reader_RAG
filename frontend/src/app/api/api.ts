const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_URL}${endpoint.startsWith('/') ? '': '/'}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response.json();
}

export async function fetchStreamingApi(endpoint: string, options: RequestInit = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    const response = await fetch(`${API_URL}${endpoint.startsWith('/') ? '': '/'}${endpoint}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }
    return response;
}

export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
    });
    return response.json();
}
