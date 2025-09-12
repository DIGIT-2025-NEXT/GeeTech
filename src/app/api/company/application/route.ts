// src/app/api/company/application/route.ts

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { applicationSchema } from "@/lib/schema/companyApplication";

// 従業員数の文字列を数値に変換するヘルパー関数
const parseEmployeeCount = (range: string): number | null => {
  if (!range) return null;
  const match =
    range.match(/^(\d+)-(\d+)人$/) ||
    range.match(/^(\d+)人以上$/) ||
    range.match(/^(\d+)人$/);
  if (match && match[1]) {
    // '5000人以上' のようなケースでは上限ではなく下限値を使うなど、仕様に応じて調整
    if (range.includes("-")) {
      const upper = range.match(/-(\d+)/);
      if (upper && upper[1]) return parseInt(upper[1], 10);
    }
    return parseInt(match[1], 10);
  }
  return null;
};

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  let requestData;

  try {
    requestData = await request.json();
    const parsedData = applicationSchema.parse(requestData);

    // データ変換
    const dbData = {
      company_name: parsedData.companyName,
      president_name: parsedData.representativeName,
      contact_email: parsedData.email,
      contact_phone: parsedData.phone,
      website: parsedData.website,
      industry_id: parsedData.industry,
      number_of_employees: parseEmployeeCount(parsedData.employeeCount),
      year_of_establishment: parsedData.establishedYear
        ? `${parsedData.establishedYear}-01-01`
        : null,
      address: parsedData.address,
      description: parsedData.description,
      business_detail: parsedData.businessContent,
      is_without_recompense: parsedData.is_without_recompense || false,
    };

    // Supabaseにデータを挿入
    const { data, error } = await supabase
      .from("company_applications")
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        {
          error: "データベースへの登録に失敗しました。",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "申請が正常に送信されました。", data },
      { status: 201 }
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "入力データが無効です。", details: e.message },
        { status: 400 }
      );
    }
    console.error("API Error:", e);
    return NextResponse.json(
      { error: "予期せぬエラーが発生しました。" },
      { status: 500 }
    );
  }
}
