const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://abio-site-backend.onrender.com/api/v1";

export async function postData<T>(endpoint: string, body: any): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("📡 POST =>", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response from server.");
  }

  if (!res.ok) {
    // Use backend message or fallback
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}

export async function getData<T>(endpoint: string): Promise<T> {
  const token = localStorage.getItem("token");
  const url = `${API_BASE_URL}${endpoint}`;
  console.log("📡 GET =>", url);

  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });

  let data: any = {};
  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response from server.");
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
}



