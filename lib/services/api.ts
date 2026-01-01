// API клиент для работы с бекендом на Render

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth
  async requestOTP(phone: string) {
    return this.request('/api/auth/otp-request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, code: string) {
    return this.request<{ token: string; user: any }>('/api/auth/otp-verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  // Reports
  async getReports(filters?: { status?: string }) {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    return this.request<any[]>(`/api/reports?${params.toString()}`);
  }

  async getReportById(id: string) {
    return this.request<any>(`/api/reports/${id}`);
  }

  async createReport(data: {
    violationType: string;
    confidence: number;
    coordinates?: string;
    evidenceUrl: string;
  }) {
    return this.request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async classifyReport(imageData: string) {
    return this.request<{
      violationType: string;
      confidence: number;
    }>('/api/reports/classify', {
      method: 'POST',
      body: JSON.stringify({ imageData }),
    });
  }

  // Wallet
  async getWallet() {
    return this.request<{
      wallet: any;
      pendingRewards: any[];
    }>('/api/wallet');
  }

  async withdraw(amount: number) {
    return this.request('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }
}

export const apiService = new ApiService();
