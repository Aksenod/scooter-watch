// API клиент для работы с бекендом на Render
// На GitHub Pages используем mock данные

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Проверяем, работаем ли мы на GitHub Pages (статический хостинг)
const isStaticHosting = typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') || !API_URL || API_URL === '');

type DemoEvidence = { id: string; type: 'photo' | 'video'; url: string }
type DemoReport = {
  id: string
  violationType: string
  status: string
  createdAt: string
  rewardAmount?: number
  confidence?: number
  latitude?: number
  longitude?: number
  evidence: DemoEvidence[]
  __demoFinalStatus?: 'fineissued' | 'rejected'
  __demoFinalAt?: number
}

type DemoReward = {
  id: string
  reportId: string
  amount: number
  status: 'pending' | 'approved' | 'paid'
  createdAt: string
}

type DemoWallet = {
  wallet: { id: string; balance: number; updatedAt: string }
  pendingRewards: DemoReward[]
}

type DemoPayoutStatus = 'created' | 'processing' | 'paid' | 'rejected'

type DemoPayoutRequest = {
  id: string
  amount: number
  status: DemoPayoutStatus
  createdAt: string
  updatedAt: string
  __demoNextStatus?: DemoPayoutStatus
  __demoNextAt?: number
}

type DemoSupportStatus = 'open' | 'in_progress' | 'resolved'

type DemoSupportTicket = {
  id: string
  subject: string
  message: string
  status: DemoSupportStatus
  createdAt: string
  updatedAt: string
}

type DemoReferralInvite = {
  userId: string
  createdAt: string
}

type DemoReferralInfo = {
  code: string
  invites: DemoReferralInvite[]
  bonusTotal: number
}

function getDemoUserKeySuffix() {
  if (typeof window === 'undefined') return 'anon'
  const token = window.localStorage.getItem('auth_token')
  return token || 'anon'
}

function getDemoReportsKey() {
  return `scooter_watch_demo_reports_${getDemoUserKeySuffix()}`
}

function getDemoWalletKey() {
  return `scooter_watch_demo_wallet_${getDemoUserKeySuffix()}`
}

function getDemoPayoutsKey() {
  return `scooter_watch_demo_payouts_${getDemoUserKeySuffix()}`
}

function getDemoSupportKey() {
  return `scooter_watch_demo_support_${getDemoUserKeySuffix()}`
}

function getDemoReferralsKeyFor(userId: string) {
  return `scooter_watch_demo_referrals_${userId}`
}

function getPendingReferrerKey() {
  return 'scooter_watch_pending_referrer'
}

function safeParseJson<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function seedDemoReports(): DemoReport[] {
  return [
    {
      id: 'report_1',
      violationType: 'sidewalk',
      status: 'fineissued',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rewardAmount: 200,
      confidence: 0.9,
      latitude: 55.7558,
      longitude: 37.6173,
      evidence: [
        { id: 'evidence_1', type: 'photo', url: 'https://mock-storage.com/photo_1.jpg' },
      ],
    },
    {
      id: 'report_2',
      violationType: 'wrongparking',
      status: 'underreview',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.82,
      latitude: 55.7558,
      longitude: 37.6173,
      evidence: [
        { id: 'evidence_2', type: 'photo', url: 'https://mock-storage.com/photo_2.jpg' },
      ],
      __demoFinalStatus: 'fineissued',
      __demoFinalAt: Date.now() - 60 * 1000,
    },
    {
      id: 'report_3',
      violationType: 'trafficviolation',
      status: 'submitted',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      confidence: 0.77,
      latitude: 55.7558,
      longitude: 37.6173,
      evidence: [
        { id: 'evidence_3', type: 'photo', url: 'https://mock-storage.com/photo_3.jpg' },
      ],
    },
  ]
}

function seedDemoWallet(): DemoWallet {
  return {
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
        status: 'paid',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'reward_2',
        reportId: 'report_2',
        amount: 150,
        status: 'pending',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  }
}

function loadDemoReports(): DemoReport[] {
  if (typeof window === 'undefined') return seedDemoReports()
  const existing = safeParseJson<DemoReport[]>(window.localStorage.getItem(getDemoReportsKey()))
  if (existing && Array.isArray(existing)) return existing
  const seeded = seedDemoReports()
  window.localStorage.setItem(getDemoReportsKey(), JSON.stringify(seeded))
  return seeded
}

function saveDemoReports(reports: DemoReport[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getDemoReportsKey(), JSON.stringify(reports))
}

function loadDemoWallet(): DemoWallet {
  if (typeof window === 'undefined') return seedDemoWallet()
  const existing = safeParseJson<DemoWallet>(window.localStorage.getItem(getDemoWalletKey()))
  if (existing && typeof existing === 'object') return existing
  const seeded = seedDemoWallet()
  window.localStorage.setItem(getDemoWalletKey(), JSON.stringify(seeded))
  return seeded
}

function saveDemoWallet(wallet: DemoWallet) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getDemoWalletKey(), JSON.stringify(wallet))
}

function seedDemoPayouts(): DemoPayoutRequest[] {
  return []
}

function loadDemoPayouts(): DemoPayoutRequest[] {
  if (typeof window === 'undefined') return seedDemoPayouts()
  const existing = safeParseJson<DemoPayoutRequest[]>(window.localStorage.getItem(getDemoPayoutsKey()))
  if (existing && Array.isArray(existing)) return existing
  const seeded = seedDemoPayouts()
  window.localStorage.setItem(getDemoPayoutsKey(), JSON.stringify(seeded))
  return seeded
}

function saveDemoPayouts(payouts: DemoPayoutRequest[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getDemoPayoutsKey(), JSON.stringify(payouts))
}

function seedDemoSupportTickets(): DemoSupportTicket[] {
  return []
}

function loadDemoSupportTickets(): DemoSupportTicket[] {
  if (typeof window === 'undefined') return seedDemoSupportTickets()
  const existing = safeParseJson<DemoSupportTicket[]>(window.localStorage.getItem(getDemoSupportKey()))
  if (existing && Array.isArray(existing)) return existing
  const seeded = seedDemoSupportTickets()
  window.localStorage.setItem(getDemoSupportKey(), JSON.stringify(seeded))
  return seeded
}

function saveDemoSupportTickets(tickets: DemoSupportTicket[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getDemoSupportKey(), JSON.stringify(tickets))
}

function seedDemoReferralInfo(userId: string): DemoReferralInfo {
  return {
    code: userId,
    invites: [],
    bonusTotal: 0,
  }
}

function loadDemoReferralInfo(userId: string): DemoReferralInfo {
  if (typeof window === 'undefined') return seedDemoReferralInfo(userId)
  const key = getDemoReferralsKeyFor(userId)
  const existing = safeParseJson<DemoReferralInfo>(window.localStorage.getItem(key))
  if (existing && typeof existing === 'object') return existing
  const seeded = seedDemoReferralInfo(userId)
  window.localStorage.setItem(key, JSON.stringify(seeded))
  return seeded
}

function saveDemoReferralInfo(userId: string, info: DemoReferralInfo) {
  if (typeof window === 'undefined') return
  const key = getDemoReferralsKeyFor(userId)
  window.localStorage.setItem(key, JSON.stringify(info))
}

function loadWalletByUserId(userId: string): DemoWallet {
  if (typeof window === 'undefined') {
    return {
      wallet: { id: 'wallet_1', balance: 0, updatedAt: new Date().toISOString() },
      pendingRewards: [],
    }
  }

  const key = `scooter_watch_demo_wallet_${userId}`
  const existing = safeParseJson<DemoWallet>(window.localStorage.getItem(key))
  if (existing && typeof existing === 'object') return existing

  const seeded: DemoWallet = {
    wallet: { id: 'wallet_1', balance: 0, updatedAt: new Date().toISOString() },
    pendingRewards: [],
  }
  window.localStorage.setItem(key, JSON.stringify(seeded))
  return seeded
}

function saveWalletByUserId(userId: string, wallet: DemoWallet) {
  if (typeof window === 'undefined') return
  const key = `scooter_watch_demo_wallet_${userId}`
  window.localStorage.setItem(key, JSON.stringify(wallet))
}

function ensureDemoFinalization() {
  const reports = loadDemoReports()
  const wallet = loadDemoWallet()
  const payouts = loadDemoPayouts()
  const now = Date.now()
  let reportsChanged = false
  let walletChanged = false
  let payoutsChanged = false

  const byReportId = new Set(wallet.pendingRewards.map((r) => r.reportId))

  for (const r of reports) {
    if (r.status === 'underreview' && typeof r.__demoFinalAt === 'number' && now >= r.__demoFinalAt) {
      const finalStatus = r.__demoFinalStatus || 'rejected'
      r.status = finalStatus
      delete r.__demoFinalAt
      delete r.__demoFinalStatus
      reportsChanged = true
    }

    if (r.status === 'fineissued' && typeof r.rewardAmount === 'number' && !byReportId.has(r.id)) {
      wallet.pendingRewards.unshift({
        id: `reward_${Date.now()}`,
        reportId: r.id,
        amount: r.rewardAmount,
        status: 'approved',
        createdAt: new Date().toISOString(),
      })
      wallet.wallet.balance += r.rewardAmount
      wallet.wallet.updatedAt = new Date().toISOString()
      byReportId.add(r.id)
      walletChanged = true
    }
  }

  for (const p of payouts) {
    if (typeof p.__demoNextAt !== 'number' || now < p.__demoNextAt) continue

    const next = p.__demoNextStatus
    if (!next) continue

    if (next === 'processing') {
      p.status = 'processing'
      p.updatedAt = new Date().toISOString()
      p.__demoNextStatus = Math.random() < 0.9 ? 'paid' : 'rejected'
      p.__demoNextAt = now + (10_000 + Math.floor(Math.random() * 30_000))
      payoutsChanged = true
      continue
    }

    if (next === 'paid') {
      p.status = 'paid'
      p.updatedAt = new Date().toISOString()
      delete p.__demoNextStatus
      delete p.__demoNextAt
      payoutsChanged = true
      continue
    }

    if (next === 'rejected') {
      p.status = 'rejected'
      p.updatedAt = new Date().toISOString()
      delete p.__demoNextStatus
      delete p.__demoNextAt

      wallet.wallet.balance += p.amount
      wallet.wallet.updatedAt = new Date().toISOString()
      walletChanged = true
      payoutsChanged = true
      continue
    }
  }

  if (reportsChanged) saveDemoReports(reports)
  if (walletChanged) saveDemoWallet(wallet)
  if (payoutsChanged) saveDemoPayouts(payouts)
}

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
      ensureDemoFinalization()
      const reports = loadDemoReports()
      const filtered = filters?.status ? reports.filter(r => r.status === filters.status) : reports
      return filtered.map((r) => ({
        id: r.id,
        violationType: r.violationType,
        status: r.status,
        createdAt: r.createdAt,
        ...(typeof r.rewardAmount === 'number' ? { rewardAmount: r.rewardAmount } : {}),
      }))
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);

    return this.request<any[]>(`/api/reports?${params.toString()}`);
  }

  async getReportById(id: string) {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 200));
      ensureDemoFinalization()
      const reports = loadDemoReports()
      const report = reports.find(r => r.id === id) || reports[0]
      return report
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
      const reports = loadDemoReports()

      let latitude: number | undefined
      let longitude: number | undefined
      if (typeof data.coordinates === 'string' && data.coordinates.includes(',')) {
        const [latRaw, lngRaw] = data.coordinates.split(',').map((s) => s.trim())
        const lat = Number(latRaw)
        const lng = Number(lngRaw)
        if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
          latitude = lat
          longitude = lng
        }
      }

      const id = `report_${Date.now()}`
      const willBeAccepted = Math.random() < 0.65
      const rewardAmount = willBeAccepted ? Math.round(150 + Math.random() * 250) : undefined
      const finalDelayMs = 30_000 + Math.floor(Math.random() * 90_000)

      const newReport: DemoReport = {
        id,
        violationType: data.violationType,
        status: 'underreview',
        createdAt: new Date().toISOString(),
        confidence: data.confidence,
        ...(typeof latitude === 'number' ? { latitude } : {}),
        ...(typeof longitude === 'number' ? { longitude } : {}),
        evidence: [
          {
            id: `evidence_${Date.now()}`,
            type: 'photo',
            url: data.evidenceUrl,
          },
        ],
        ...(willBeAccepted && typeof rewardAmount === 'number' ? { rewardAmount } : {}),
        __demoFinalStatus: willBeAccepted ? 'fineissued' : 'rejected',
        __demoFinalAt: Date.now() + finalDelayMs,
      }

      reports.unshift(newReport)
      saveDemoReports(reports)
      return {
        id: newReport.id,
        violationType: newReport.violationType,
        status: newReport.status,
        createdAt: newReport.createdAt,
      }
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
      ensureDemoFinalization()
      const wallet = loadDemoWallet()
      const payoutRequests = loadDemoPayouts()
      return { ...wallet, payoutRequests }
    }
    return this.request<{
      wallet: any;
      pendingRewards: any[];
    }>('/api/wallet');
  }

  async withdraw(amount: number): Promise<{ success: boolean; message?: string }> {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 500));
      ensureDemoFinalization()
      const data = loadDemoWallet()
      if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
        return { success: false, message: 'Некорректная сумма' }
      }
      if (data.wallet.balance < amount) {
        return { success: false, message: 'Недостаточно средств' }
      }

      data.wallet.balance -= amount
      data.wallet.updatedAt = new Date().toISOString()
      saveDemoWallet(data)

      const payouts = loadDemoPayouts()
      const createdAt = new Date().toISOString()
      payouts.unshift({
        id: `payout_${Date.now()}`,
        amount,
        status: 'created',
        createdAt,
        updatedAt: createdAt,
        __demoNextStatus: 'processing',
        __demoNextAt: Date.now() + (3_000 + Math.floor(Math.random() * 7_000)),
      })
      saveDemoPayouts(payouts)

      return { success: true, message: 'Заявка на вывод создана (демо)' };
    }
    return this.request<{ success: boolean; message?: string }>('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getSupportTickets(): Promise<DemoSupportTicket[]> {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return loadDemoSupportTickets()
    }
    return this.request<DemoSupportTicket[]>('/api/support')
  }

  async createSupportTicket(data: { subject: string; message: string }): Promise<DemoSupportTicket> {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const subject = data?.subject
      const message = data?.message
      if (!subject || typeof subject !== 'string') {
        throw new Error('subject is required')
      }
      if (!message || typeof message !== 'string') {
        throw new Error('message is required')
      }

      const tickets = loadDemoSupportTickets()
      const now = new Date().toISOString()
      const ticket: DemoSupportTicket = {
        id: `ticket_${Date.now()}`,
        subject,
        message,
        status: 'open',
        createdAt: now,
        updatedAt: now,
      }
      tickets.unshift(ticket)
      saveDemoSupportTickets(tickets)
      return ticket
    }
    return this.request<DemoSupportTicket>('/api/support', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getReferralInfo(): Promise<DemoReferralInfo> {
    if (isStaticHosting) {
      await new Promise(resolve => setTimeout(resolve, 250));
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : null
      const userId = token || 'anon'
      return loadDemoReferralInfo(userId)
    }
    return this.request<DemoReferralInfo>('/api/referrals')
  }

  async applyPendingReferral(): Promise<{ applied: boolean; message?: string }> {
    if (typeof window === 'undefined') return { applied: false }

    const referrerId = window.localStorage.getItem(getPendingReferrerKey())
    if (!referrerId) return { applied: false }

    const invitedUserId = window.localStorage.getItem('auth_token')
    if (!invitedUserId) return { applied: false }

    window.localStorage.removeItem(getPendingReferrerKey())

    if (referrerId === invitedUserId) return { applied: false }

    if (!isStaticHosting) {
      await this.request('/api/referrals/apply', {
        method: 'POST',
        body: JSON.stringify({ referrerId }),
      })
      return { applied: true }
    }

    const refInfo = loadDemoReferralInfo(referrerId)
    const already = refInfo.invites.some((i) => i.userId === invitedUserId)
    if (already) return { applied: false }

    refInfo.invites.unshift({ userId: invitedUserId, createdAt: new Date().toISOString() })

    const bonus = 100
    refInfo.bonusTotal += bonus
    saveDemoReferralInfo(referrerId, refInfo)

    const refWallet = loadWalletByUserId(referrerId)
    refWallet.wallet.balance += bonus
    refWallet.wallet.updatedAt = new Date().toISOString()
    saveWalletByUserId(referrerId, refWallet)

    const rawUser = window.localStorage.getItem('auth_user')
    if (rawUser) {
      try {
        const u = JSON.parse(rawUser)
        window.localStorage.setItem('auth_user', JSON.stringify({ ...u, referredBy: referrerId }))
      } catch {
        // ignore
      }
    }

    return { applied: true, message: 'Реферал применён' }
  }
}

export const apiService = new ApiService();
