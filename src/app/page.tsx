// في الصفحة فيجب ان نجعلها تُعرض من جانب العميل وليس السيرفر useState بما اننا سنقوم بإضافة
"use client";
import React, { useState } from "react";

export default function Home() {
  // للحصول على الملف الذي يدخله المستخدم
  const [theFile, setTheFile] = useState<File | null>(null);
  // OpenAI ستظهر للمستخدم نص اثناء الإنتظار لرد
  const [isLoading, setIsLoading] = useState(false);
  // وسنظهره في الصفحة OpenAI لتخزين الرد الذي سنحصل عليه من
  const [response, setResponse] = useState("");

  // التفاعل مع التعديلات التي تحدث في خانة رفع الملفات
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;

    // لأي شيء يقوم المستخد بتحميله theFile تعيين حالة
    setTheFile(file);
  };

  /**
   * OpenAI تقوم هذه الدالة بالإتصال برد
   */
  const getTranscription = async () => {
    // يظهر للمستخدم انه ما زال البوت يقوم بالرد وعليه الإنتظار حتى ينتهي
    setIsLoading(true);

    // إذا لم يكن هناك ملف فإن الدالة لن تعيد أي شيء
    if (!theFile) {
      setIsLoading(false);
      return;
    }
    const formData = new FormData();
    formData.set("file", theFile);

    try {
      // الخاص بنا API نقوم بإرسال طلب الى
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      // التعامل مع حالة الإرسال
      if (response.ok) {
        console.log("File uploaded!");
      } else {
        console.error("Failed!");
      }

      const data = await response.json();
      // الذي سنعرضه في الصفحة response يقوم بتخزين المخرجات الى المتغير
      setResponse(data.output.text);
    } catch (error) {
      console.error(error);
    }

    setTheFile(null);
    setIsLoading(false);
  };

  return (
    <main dir="rtl" className="m-2">
      <div>
        <div>
          <input type="file" accept=".wav, .mp3" onChange={handleFileChange} />
          <div>
            {isLoading ? "يرجى الإنتظار..." : response ? response : ""}
          </div>
        </div>
        <div>
          <button
            onClick={getTranscription}
            className="bg-red-900 text-white px-8 py-3 mt-2 rounded-sm"
          >
            رفع الملف
          </button>
        </div>
      </div>
    </main>
  );
}
