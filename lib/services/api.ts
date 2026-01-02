// API клиент для работы с бекендом на Render
// На GitHub Pages используем mock данные

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Проверяем, работаем ли мы на GitHub Pages (статический хостинг)
const isStaticHosting = typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || !API_URL || API_URL === '');

// Mock данные для демо-режима
const mockReports = [
  {
    id: 'report_1',
    violationType: 'sidewalk',
    status: 'fineissued',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rewardAmount: 200,
  },
  {
    id: 'report_2',
    violationType: 'wrongparking',
    status: 'underreview',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'report_3',
    violationType: 'trafficviolation',
    status: 'submitted',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const mockWallet = {
  wallet: {
    id: 'wallet_1',
    balance: 420,
    updatedAt: new Date().toISOString(),
  },
  pendingRewards: [
    {
      id: 'reward_1',
      reportId: 'report_1',
      amount: 200,
      status: 'paid' as const,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'reward_2',
      reportId: 'report_2',
      amount: 150,
      status: 'pending' as const,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // На статическом хостинге не делаем реальные запросы
    if (isStaticHosting) {
      throw new Error('Static hosting - use mock data');
    }

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
    if (isStaticHosting) {
      return { success: true, message: 'OTP отправлен (демо)' };
    }
    return this.request('/api/auth/otp-request', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOTP(phone: string, code: string) {
    if (isStaticHosting) {
      const normalizedPhone = phone.replace(/\D/g, '');
      return {
        token: `user_${normalizedPhone}`,
        user: {
          id: `user_${normalizedPhone}`,
          phone: normalizedPhone,
          name: `User ${normalizedPhone.slice(-4)}`,
        },
      };
    }
    return this.request<{ token: string; user: any }>('/api/auth/otp-verify', {
      method: 'POST',
      body: JSON.stringify({ phone, code }),
    });
  }

  // Reports
  async getReports(filters?: { status?: string }) {
    if (isStaticHosting) {
      // Симулируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 300));
      if (filters?.status) {
        return mockReports.filter(r => r.status === filters.status);
      }
      return mockReports;
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    return this.request<any[]>(`/api/reports?${params.toString()}`);
  }

  async getReportById(id: string) {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return mockReports.find(r => r.id === id) || mockReports[0];
    }
    return this.request<any>(`/api/reports/${id}`);
  }

  async createReport(data: {
    violationType: string;
    confidence: number;
    coordinates?: string;
    evidenceUrl: string;
  }) {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newReport = {
        id: `report_${Date.now()}`,
        ...data,
        status: 'submitted',
        createdAt: new Date().toISOString(),
      };
      mockReports.unshift(newReport);
      return newReport;
    }
    return this.request('/api/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async classifyReport(imageData: string) {
    if (isStaticHosting) {
      // Симулируем AI классификацию
      await new Promise(resolve => setTimeout(resolve, 1500));
      const violationTypes = ['sidewalk', 'wrongparking', 'trafficviolation', 'helmetmissing'];
      const randomType = violationTypes[Math.floor(Math.random() * violationTypes.length)];
      const confidence = 0.75 + Math.random() * 0.20; // 75-95%
      return {
        violationType: randomType,
        confidence: Math.round(confidence * 100) / 100,
      };
    }
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
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockWallet;
    }
    return this.request<{
      wallet: any;
      pendingRewards: any[];
    }>('/api/wallet');
  }

  async withdraw(amount: number) {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true, message: 'Запрос на вывод создан (демо)' };
    }
    return this.request('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }
}

export const apiService = new ApiService();
