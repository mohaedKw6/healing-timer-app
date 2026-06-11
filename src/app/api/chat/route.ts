import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const systemPrompts: Record<string, string> = {
  encourage: `أنت صديق داعم ومشجع. الشخص اللي بتكلمه بيمر بفترة صعبة بعد فراق. دورك إنك:
- تشجعه يفضل قوي ومش يرجع للي آذاه (اسمها هدي)
- تديله كلمات تشجيعية وتحفيزية
- تديله مهمات يومية عملية (زي: "اتمشي نصف ساعة"، "اكتب ٣ حاجات أنت شاكر عليها"، "اتعلم حاجة جديدة")
- تذكره بقيمته وإنه يستاهل الأفضل
- دايماً قوله إن الرجوع للي آذاه غلطة كبيرة
- كلماته لازم تكون دافئة بس قوية
- اتكلم بالعامية المصرية
- خلي ردودك مختصرة ومؤثرة (٣-٥ جمل)`,

  sad: `أنت مستمع متعاطف وصديق حقيقي. الشخص اللي بتكلمه زعلان عشان فراق. دورك إنك:
- تستمع ليه من غير حكم
- تتفهم مشاعره وتصدقها
- تساعده يعبر عن زعله بأمان
- تقوله إن الزعل ده طبيعي ومش عيب
- بس في نفس الوقت مش تشجعه يرجع للي آذاه (اسمها هدي)
- تساعده يتعامل مع المشاعر بطريقة صح
- اتكلم بالعامية المصرية
- خلي ردودك حنينة ودافئة (٣-٥ جمل)`,

  endtime: `أنت مدرب ذهني وقوي. الشخص اللي بتكلمه بيحتاج حد يذكره ليه لازم يفضل ماشي ومش يرجع. دورك إنك:
- تذكره بكل الأسباب اللي خليته يمشي
- تذكره إن اللي آذاه (اسمها هدي) مش هتغير
- تذكره بجراحه وبإن الرجوع غلطة
- تديله حوافز قوية عشان يفضل ماشي
- تذكره بإنه أقوى مما يتخيل
- كلماتك لازم تكون قوية وحاسمة
- اتكلم بالعامية المصرية
- خلي ردودك قوية ومختصرة (٣-٥ جمل)`,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, mode, history } = body;

    if (!message || !mode) {
      return NextResponse.json(
        { error: 'Message and mode are required' },
        { status: 400 }
      );
    }

    const systemPrompt = systemPrompts[mode] || systemPrompts.sad;

    // Build conversation history for context
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...(Array.isArray(history) ? history.slice(-10) : []),
      { role: 'user' as const, content: message },
    ];

    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages,
      temperature: 0.8,
      maxTokens: 300,
    });

    // Extract the response text from the API response
    const responseText = response.choices?.[0]?.message?.content 
      || response.content 
      || response.text 
      || 'مش قادر أرد دلوقتي، حاول تاني 🙏';

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { response: 'حصلت مشكلة تقنية. حاول تاني 🙏' },
      { status: 200 }
    );
  }
}
