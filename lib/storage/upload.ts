export async function uploadVideoMock(file: Blob): Promise<{ url: string }> {
  // заглушка под Supabase Storage
  void file
  await new Promise((r) => setTimeout(r, 800))
  return { url: `https://mock-storage.com/video_${Date.now()}.webm` }
}
