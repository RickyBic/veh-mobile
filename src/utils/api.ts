const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

export async function fetchScenario(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}
