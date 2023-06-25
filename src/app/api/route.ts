import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
    // req.formData() متغير يقوم اولاً بتخزين
    const data = await req.formData();
    const theFile: File | null = data.get("file") as unknown as File;

    const formData = new FormData();
    formData.append("file", theFile);
    formData.append("model", "whisper-1");

    /**
     * الذي يقوم بالتعامل مع الملفات التي سيقوم المستخدم برفعها api التواصل مع
     * OPENAI_API_KEY تهيئة المشروع بمفتاح
     */
    const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: formData,
        }
    );

    const body = await response.json();
    // نقوم بإعادة المخرجات إلى الواجهة الامامية
    return NextResponse.json({ output: body });
}
