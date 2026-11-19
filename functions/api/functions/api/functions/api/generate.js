import { fal } from '@fal-ai/client';

export async function onRequestPost({ request, env }) {
  try {
    if (!env.FAL_KEY) return Response.json({ error: 'لم يتم ضبط مفتاح FAL_KEY في إعدادات الاستضافة.' }, { status: 500 });
    const body = await request.json();
    const { imageData, prompt } = body || {};
    if (!imageData || typeof imageData !== 'string' || !imageData.startsWith('data:image/')) return Response.json({ error: 'ارفع صورة شخصية أولاً.' }, { status: 400 });
    if (!prompt || typeof prompt !== 'string') return Response.json({ error: 'اكتب وصف المشهد.' }, { status: 400 });
    fal.config({ credentials: env.FAL_KEY });
    const result = await fal.subscribe('fal-ai/vidu/image-to-video', {
      input: { prompt: prompt.slice(0, 1500), image_url: imageData, movement_amplitude: 'auto', enable_safety_checker: true }
    });
    return Response.json({ videoUrl: result.data?.video?.url, requestId: result.requestId });
  } catch (e) {
    return Response.json({ error: e?.message || 'تعذر توليد الفيديو حالياً.' }, { status: 500 });
  }
}
