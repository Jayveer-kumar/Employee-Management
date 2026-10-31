const BASE = "http://localhost:8080/api/employees";

async function request(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    // ResponseStatusException ka message JSON me "message" ya "reason" me aata hai
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.message || data.reason || data.error || msg;
    } catch {
      /* body empty ho sakti hai */
    }
    throw new Error(msg);
  }

  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

//  (Spring Page response: content, totalPages, totalElements, number)
export function fetchEmployees({ page = 0, size = 5, sortBy = "id", direction = "asc" }) {
  const params = new URLSearchParams({ page, size, sortBy, direction });
  return request(`${BASE}?${params.toString()}`);
}

export function addNewEmployee(data){
  return request(`${BASE}`,{ method : "POST" , body : JSON.stringify(data)} );
}

export function updateEmployee(id, data) {
  return request(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deleteEmployee(id) {
  return request(`${BASE}/${id}`, { method: "DELETE" });
}

