// Клиентский сервис для работы с данными (localStorage или API)

export interface User {
  id: string;
  phone: string;
  name?: string;
}

export interface Report {
  id: string;
  userId: string;
  violationType: 'sidewalk' | 'wrongparking' | 'trafficviolation' | 'helmetmissing';
  status: 'submitted' | 'underreview' | 'fineissued' | 'rejected';
  confidence: number;
  coordinates?: string;
  createdAt: string;
  evidence?: Evidence[];
  reward?: Reward;
}

export interface Evidence {
  id: string;
  reportId: string;
  type: 'photo' | 'video';
  url: string;
}

export interface Reward {
  id: string;
  userId: string;
  reportId: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid';
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  updatedAt: string;
}

class StorageService {
  private getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Auth
  getAuthToken(): string | null {
    return this.getItem<string>('auth_token');
  }

  setAuthToken(token: string): void {
    this.setItem('auth_token', token);
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  getCurrentUser(): User | null {
    return this.getItem<User>('current_user');
  }

  setCurrentUser(user: User): void {
    this.setItem('current_user', user);
  }

  removeCurrentUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('current_user');
    }
  }

  // Reports
  getReports(): Report[] {
    return this.getItem<Report[]>('reports') || [];
  }

  setReports(reports: Report[]): void {
    this.setItem('reports', reports);
  }

  addReport(report: Report): void {
    const reports = this.getReports();
    reports.unshift(report);
    this.setReports(reports);
  }

  updateReport(id: string, updates: Partial<Report>): void {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index] = { ...reports[index], ...updates };
      this.setReports(reports);
    }
  }

  getReportById(id: string): Report | null {
    const reports = this.getReports();
    return reports.find(r => r.id === id) || null;
  }

  // Wallet
  getWallet(): Wallet | null {
    return this.getItem<Wallet>('wallet');
  }

  setWallet(wallet: Wallet): void {
    this.setItem('wallet', wallet);
  }

  updateWalletBalance(amount: number): void {
    const wallet = this.getWallet();
    if (wallet) {
      wallet.balance = amount;
      wallet.updatedAt = new Date().toISOString();
      this.setWallet(wallet);
    }
  }

  // Rewards
  getRewards(): Reward[] {
    return this.getItem<Reward[]>('rewards') || [];
  }

  setRewards(rewards: Reward[]): void {
    this.setItem('rewards', rewards);
  }

  addReward(reward: Reward): void {
    const rewards = this.getRewards();
    rewards.unshift(reward);
    this.setRewards(rewards);
  }

  // Initialize demo data
  initializeDemoData(): void {
    if (!this.getCurrentUser()) {
      const demoUser: User = {
        id: 'demo-user-1',
        phone: '+79991234567',
        name: 'Демо Пользователь'
      };
      this.setCurrentUser(demoUser);

      const demoWallet: Wallet = {
        id: 'wallet-1',
        userId: demoUser.id,
        balance: 0,
        updatedAt: new Date().toISOString()
      };
      this.setWallet(demoWallet);
    }

    if (this.getReports().length === 0) {
      const demoReports: Report[] = [
        {
          id: 'report-1',
          userId: 'demo-user-1',
          violationType: 'sidewalk',
          status: 'fineissued',
          confidence: 0.95,
          coordinates: '55.7558,37.6173',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          evidence: [{
            id: 'evidence-1',
            reportId: 'report-1',
            type: 'photo',
            url: 'https://via.placeholder.com/400x300/667eea/ffffff?text=Scooter+on+Sidewalk'
          }],
          reward: {
            id: 'reward-1',
            userId: 'demo-user-1',
            reportId: 'report-1',
            amount: 200,
            status: 'paid',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        },
        {
          id: 'report-2',
          userId: 'demo-user-1',
          violationType: 'wrongparking',
          status: 'underreview',
          confidence: 0.87,
          coordinates: '55.7512,37.6184',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          evidence: [{
            id: 'evidence-2',
            reportId: 'report-2',
            type: 'photo',
            url: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Wrong+Parking'
          }],
          reward: {
            id: 'reward-2',
            userId: 'demo-user-1',
            reportId: 'report-2',
            amount: 150,
            status: 'pending',
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          }
        }
      ];
      this.setReports(demoReports);

      const demoRewards: Reward[] = demoReports.map(r => r.reward!).filter(Boolean);
      this.setRewards(demoRewards);
    }
  }

  clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}

export const storageService = new StorageService();
