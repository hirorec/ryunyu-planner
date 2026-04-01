import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

interface GeneratePlanRequest {
  babyName: string;
  stageLabel: string;
  okFoodNames: string[];
  untriedFoodNames: string[];
  ngFoodNames: string[];
}

export async function POST(req: Request) {
  const body: GeneratePlanRequest = await req.json();
  const { babyName, stageLabel, okFoodNames, untriedFoodNames, ngFoodNames } =
    body;

  const prompt = `あなたは離乳食の専門家です。${babyName}ちゃん（${stageLabel}）の7日分の献立を考えてください。

【試食済み食材（使用可能）】
${okFoodNames.join("、")}

【未試食食材（積極的に取り入れて）】
${untriedFoodNames.length > 0 ? untriedFoodNames.join("、") : "なし"}

【使用禁止食材（NG）】
${ngFoodNames.length > 0 ? ngFoodNames.join("、") : "なし"}

【ルール】
- mainには主食（お粥、うどん、食パンなど炭水化物）を指定
- sidesには1〜3品の副菜（野菜・タンパク質）を指定
- 未試食食材を週に2〜3回自然に取り入れる
- 同じ食材が3日以上連続しないようにする
- ${stageLabel}に適した食材・調理法を使用（食材名は簡潔に）

以下のJSON形式のみで返してください（前後の説明テキスト不要）:
[
  {
    "breakfast": { "main": "お粥", "sides": ["にんじんペースト", "豆腐"] },
    "lunch":     { "main": "うどん", "sides": ["ほうれん草", "白身魚"] },
    "dinner":    { "main": "お粥", "sides": ["かぼちゃ", "しらす"] }
  }
]
配列は7要素（月〜日）で返してください。`;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AIの応答からJSONを取得できませんでした" },
        { status: 500 },
      );
    }

    const plan = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ plan });
  } catch (err) {
    console.error("generate-plan error:", err);
    return NextResponse.json(
      { error: "献立の生成に失敗しました" },
      { status: 500 },
    );
  }
}
