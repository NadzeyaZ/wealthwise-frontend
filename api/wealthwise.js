const API = import.meta.env.VITE_API;

// auth
export async function getCurrentUser(token) {
  const response = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function authenticate(endpoint, credentials) {
  const response = await fetch(`${API}/users/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const token = await response.text();

  if (!response.ok) {
    throw new Error(token);
  }

  return token;
}

export function registerUser(credentials) {
  return authenticate("register", credentials);
}

export function loginUser(credentials) {
  return authenticate("login", credentials);
}

// advisor
export async function getAdvisorClients(token) {
  const response = await fetch(`${API}/clients`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load clients");
  }

  return response.json();
}

export async function addInvestment(clientId, token, investment) {
  const response = await fetch(`${API}/clients/${clientId}/investments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(investment),
  });

  if (!response.ok) {
    throw new Error("Failed to add investment");
  }

  return response.json();
}

export async function updateInvestment(
  clientId,
  investmentId,
  token,
  quantity,
) {
  const response = await fetch(
    `${API}/clients/${clientId}/investments/${investmentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update investment");
  }

  return response.json();
}

export async function addRecommendation(token, recommendation) {
  const response = await fetch(`${API}/recommendations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recommendation),
  });

  if (!response.ok) {
    throw new Error("Failed to add recommendation");
  }

  return response.json();
}

export async function deleteRecommendation(recId, token) {
  const response = await fetch(`${API}/recommendations/${recId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete recommendation");
  }
}

// client
export async function getClientAdvisors(clientId, token) {
  const response = await fetch(`${API}/clients/${clientId}/advisor`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load advisors");
  }

  return response.json();
}

export async function getInvestments(clientId, token) {
  const response = await fetch(`${API}/clients/${clientId}/investments`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load investments");
  }

  return response.json();
}

export async function getGoals(clientId, token) {
  const response = await fetch(`${API}/clients/${clientId}/goals`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load goals");
  }

  return response.json();
}

export async function addGoal(token, goal) {
  const response = await fetch(`${API}/goals`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goal),
  });

  if (!response.ok) {
    throw new Error("Failed to add goal");
  }

  return response.json();
}

export async function deleteGoal(goalId, token) {
  const response = await fetch(`${API}/goals/${goalId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to delete goal");
  }
}

export async function getRecommendations(clientId, token) {
  const response = await fetch(`${API}/recommendations?clientId=${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to load recommendations");
  }

  return response.json();
}

export async function updateRecommendationStatus(recId, token, status) {
  const response = await fetch(`${API}/recommendations/${recId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Failed to ${status} recommendation`);
  }

  return response.json();
}
