export type ViolationType = 'sidewalk' | 'wrongparking' | 'trafficviolation' | 'helmetmissing'

export async function classifyViolationMock(): Promise<{ violationType: ViolationType; confidence: number }> {
  const types: ViolationType[] = ['sidewalk', 'wrongparking', 'trafficviolation', 'helmetmissing']
  const violationType = types[Math.floor(Math.random() * types.length)]
  const confidence = 0.7 + Math.random() * 0.3
  return { violationType, confidence }
}
