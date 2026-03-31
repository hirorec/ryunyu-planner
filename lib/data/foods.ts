import type { FoodItem } from "@/lib/types";

/**
 * 離乳食食材マスタ
 * availableFrom: その食材を始められる最も早いステージ
 * prep: ステージ別の調理・テクスチャの目安
 *
 * TODO 本番移行時: このファイルをデータベース（Supabase等）に移行する
 * → lib/services/foods.service.ts の getFoods() をAPI呼び出しに変更するだけでOK
 */
export const FOODS: FoodItem[] = [
  // ─── 炭水化物 ───────────────────────────────────────────────────────────────
  {
    id: "okayu",
    name: "お粥（おかゆ）",
    category: "carb",
    subcategory: "米・穀物",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "10倍粥・なめらかにすりつぶす",
      mid: "7倍粥・粒が残る程度",
      late: "5倍粥〜軟飯",
      complete: "軟飯〜普通ご飯",
    },
    notes: "初期は10倍粥からスタート",
  },
  {
    id: "udon",
    name: "うどん",
    category: "carb",
    subcategory: "米・穀物",
    availableFrom: "early",
    allergyRisk: "specific",
    allergyNote: "小麦",
    prep: {
      early: "やわらかく茹でてすりつぶす",
      mid: "3〜4mm程度に切る",
      late: "1cm程度に切る",
      complete: "1〜2cmでOK",
    },
    notes: "食塩なしを選ぶ。十分にやわらかく",
  },
  {
    id: "bread",
    name: "食パン",
    category: "carb",
    subcategory: "米・穀物",
    availableFrom: "early",
    allergyRisk: "specific",
    allergyNote: "小麦・乳成分",
    prep: {
      early: "耳を除きパン粥にする",
      mid: "耳を除き細かくちぎるかパン粥",
      late: "耳を除き小さく切る",
      complete: "耳ごと食べられる",
    },
    notes: "塩分・バター含有量に注意",
  },
  {
    id: "potato",
    name: "じゃがいも",
    category: "carb",
    subcategory: "いも類",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてなめらかにすりつぶす",
      mid: "茹でてつぶす",
      late: "茹でて粗くつぶすか小さく切る",
      complete: "茹でて軟らかければOK",
    },
  },
  {
    id: "sweetpotato",
    name: "さつまいも",
    category: "carb",
    subcategory: "いも類",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてなめらかにすりつぶす",
      mid: "茹でてつぶす",
      late: "茹でて粗くつぶすか小さく切る",
      complete: "茹でて食べやすく切る",
    },
    notes: "甘みがあり食べやすい",
  },
  {
    id: "pumpkin",
    name: "かぼちゃ",
    category: "carb",
    subcategory: "いも類",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてなめらかにすりつぶす",
      mid: "茹でてつぶす",
      late: "茹でて粗くつぶすか小さく切る",
      complete: "茹でて食べやすく切る",
    },
    notes: "甘みがあり食べやすい",
  },
  {
    id: "macaroni",
    name: "マカロニ・パスタ",
    category: "carb",
    subcategory: "米・穀物",
    availableFrom: "mid",
    allergyRisk: "specific",
    allergyNote: "小麦",
    prep: {
      mid: "やわらかく茹でて5mm程度",
      late: "やわらかく茹でて1cm程度",
      complete: "普通の茹で時間でOK",
    },
    notes: "食塩なし・無添加を選ぶ",
  },

  // ─── 魚・魚介 ────────────────────────────────────────────────────────────────
  {
    id: "whiteFish",
    name: "白身魚（たら・ひらめ・かれい）",
    category: "fish",
    subcategory: "魚",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてなめらかにすりつぶす",
      mid: "茹でてほぐす（繊維感残す）",
      late: "茹でてほぐす（1cm程度）",
      complete: "焼く・蒸すなど多様な調理",
    },
    notes: "骨を十分に取り除く",
  },
  {
    id: "shirasu",
    name: "しらす干し",
    category: "fish",
    subcategory: "魚",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "熱湯で塩抜き・すりつぶす",
      mid: "熱湯で塩抜きしてほぐす",
      late: "熱湯で塩抜きして与える",
      complete: "塩抜きして与える",
    },
    notes: "必ず塩抜きする",
  },
  {
    id: "salmon",
    name: "鮭（さけ）",
    category: "fish",
    subcategory: "魚",
    availableFrom: "mid",
    allergyRisk: "none",
    prep: {
      mid: "茹でてほぐす（骨・皮除く）",
      late: "茹でてほぐす（骨・皮除く）",
      complete: "焼く・蒸すなど多様な調理",
    },
    notes: "骨・皮をしっかり除く",
  },
  {
    id: "tuna",
    name: "ツナ缶（水煮・ノーオイル）",
    category: "fish",
    subcategory: "魚",
    availableFrom: "mid",
    allergyRisk: "none",
    prep: {
      mid: "湯通しして細かくほぐす",
      late: "湯通しして与える",
      complete: "そのまま（湯通し推奨）",
    },
    notes: "食塩・油無添加を選ぶ",
  },
  {
    id: "redFish",
    name: "赤身魚（まぐろ・かつお）",
    category: "fish",
    subcategory: "魚",
    availableFrom: "mid",
    allergyRisk: "none",
    prep: {
      mid: "茹でてほぐす・すりつぶす",
      late: "茹でてほぐす",
      complete: "刺身用を湯通し・調理して",
    },
    notes: "生食は1歳以降推奨",
  },

  // ─── 肉類 ────────────────────────────────────────────────────────────────────
  {
    id: "chickenSasami",
    name: "鶏ささみ",
    category: "meat",
    subcategory: "鶏肉",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてなめらかにすりつぶす",
      mid: "茹でて細かくほぐす",
      late: "茹でてほぐす",
      complete: "茹でてほぐす・焼くなど多様に",
    },
    notes: "脂肪が少なく消化しやすい",
  },
  {
    id: "chickenBreast",
    name: "鶏むね肉",
    category: "meat",
    subcategory: "鶏肉",
    availableFrom: "mid",
    allergyRisk: "none",
    prep: {
      mid: "茹でてほぐしてすりつぶす",
      late: "茹でてほぐす",
      complete: "茹でてほぐす・焼くなど",
    },
    notes: "皮は除く",
  },
  {
    id: "porkMince",
    name: "豚ひき肉",
    category: "meat",
    subcategory: "豚肉",
    availableFrom: "mid",
    allergyRisk: "none",
    prep: {
      mid: "よく加熱してほぐす（少量）",
      late: "よく加熱して与える",
      complete: "よく加熱して与える",
    },
    notes: "脂肪分少なめを選ぶ",
  },

  // ─── 豆類・大豆製品 ──────────────────────────────────────────────────────────
  {
    id: "tofu",
    name: "豆腐",
    category: "bean",
    subcategory: "大豆製品",
    availableFrom: "early",
    allergyRisk: "related",
    allergyNote: "大豆",
    prep: {
      early: "なめらかにすりつぶす（加熱推奨）",
      mid: "加熱して粗くつぶす",
      late: "加熱して食べやすく切る",
      complete: "加熱なしでも可",
    },
    notes: "初期から使えるタンパク源として優秀",
  },
  {
    id: "natto",
    name: "納豆",
    category: "bean",
    subcategory: "大豆製品",
    availableFrom: "mid",
    allergyRisk: "related",
    allergyNote: "大豆",
    prep: {
      mid: "ひきわり納豆・よく刻む",
      late: "ひきわり納豆か細かく刻む",
      complete: "そのまま与えられる",
    },
    notes: "ねばりが強いため初期は不向き",
  },
  {
    id: "kinako",
    name: "きな粉",
    category: "bean",
    subcategory: "大豆製品",
    availableFrom: "mid",
    allergyRisk: "related",
    allergyNote: "大豆",
    prep: {
      mid: "お粥・ヨーグルトに混ぜる",
      late: "お粥・料理に混ぜる",
      complete: "料理に混ぜる",
    },
    notes: "粉を直接与えると誤嚥リスクあり",
  },

  // ─── 卵 ──────────────────────────────────────────────────────────────────────
  {
    id: "eggYolk",
    name: "卵黄",
    category: "egg",
    subcategory: "卵",
    availableFrom: "mid",
    allergyRisk: "specific",
    allergyNote: "卵",
    prep: {
      mid: "固茹での卵黄を耳かき1杯から",
      late: "固茹での卵黄をつぶして与える",
      complete: "全卵でOK",
    },
    notes: "必ず固茹でに。耳かき1杯から始める",
  },
  {
    id: "wholeEgg",
    name: "全卵",
    category: "egg",
    subcategory: "卵",
    availableFrom: "late",
    allergyRisk: "specific",
    allergyNote: "卵",
    prep: {
      late: "固茹でをよくつぶして少量から",
      complete: "固茹で・スクランブルなど多様に",
    },
    notes: "卵黄に慣れてから全卵に移行",
  },

  // ─── 野菜 ────────────────────────────────────────────────────────────────────
  {
    id: "carrot",
    name: "にんじん",
    category: "veggie",
    subcategory: "根菜",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてなめらかにすりつぶす",
      mid: "茹でてつぶすかみじん切り",
      late: "茹でて粗くつぶすか小さく切る",
      complete: "茹でて食べやすく切る",
    },
    notes: "甘みがあり食べやすい",
  },
  {
    id: "spinach",
    name: "ほうれん草",
    category: "veggie",
    subcategory: "葉野菜",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でて葉先だけ・すりつぶす",
      mid: "茹でて葉先・みじん切り",
      late: "茹でて細かく刻む",
      complete: "茹でて食べやすく刻む",
    },
    notes: "アクを十分取る。ゆで汁は捨てる",
  },
  {
    id: "broccoli",
    name: "ブロッコリー",
    category: "veggie",
    subcategory: "実野菜",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "花蕾部分を茹でてすりつぶす",
      mid: "花蕾部分を茹でてほぐす",
      late: "花蕾部分を茹でて小房に",
      complete: "茹でて食べやすく",
    },
    notes: "茎は硬いので初期は使わない",
  },
  {
    id: "tomato",
    name: "トマト",
    category: "veggie",
    subcategory: "実野菜",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "皮・種除いてすりつぶす・加熱",
      mid: "皮・種除いて細かく刻む",
      late: "皮・種除いて小さく切る",
      complete: "皮をむけばそのままOK",
    },
    notes: "種・皮は消化しにくいので除く",
  },
  {
    id: "onion",
    name: "玉ねぎ",
    category: "veggie",
    subcategory: "根菜",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でてすりつぶす",
      mid: "茹でてみじん切り",
      late: "茹でて小さく切る",
      complete: "炒める・茹でるなど多様に",
    },
    notes: "アクを取る。よく加熱する",
  },
  {
    id: "komatsuna",
    name: "小松菜",
    category: "veggie",
    subcategory: "葉野菜",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "茹でて葉先だけ・すりつぶす",
      mid: "茹でて葉先・みじん切り",
      late: "茹でて細かく刻む",
      complete: "茹でて食べやすく刻む",
    },
    notes: "ほうれん草よりアクが少ない",
  },

  // ─── 果物 ────────────────────────────────────────────────────────────────────
  {
    id: "banana",
    name: "バナナ",
    category: "fruit",
    subcategory: "国産果物",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "なめらかにすりつぶす",
      mid: "つぶすか細かく切る",
      late: "小さく切る",
      complete: "そのまま与えられる",
    },
    notes: "甘みが強い。与えすぎ注意",
  },
  {
    id: "apple",
    name: "りんご",
    category: "fruit",
    subcategory: "国産果物",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "すりおろして加熱",
      mid: "すりおろす・細かく煮る",
      late: "薄く切って加熱か生で少量",
      complete: "薄く切ってそのまま",
    },
    notes: "初期は加熱推奨",
  },
  {
    id: "strawberry",
    name: "いちご",
    category: "fruit",
    subcategory: "国産果物",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "すりつぶす",
      mid: "つぶして与える",
      late: "小さく切る",
      complete: "そのまま与えられる",
    },
  },
  {
    id: "grape",
    name: "ぶどう",
    category: "fruit",
    subcategory: "国産果物",
    availableFrom: "mid",
    allergyRisk: "none",
    prep: {
      mid: "皮・種除いてすりつぶす",
      late: "皮・種除いて小さく切る",
      complete: "皮・種除いてそのまま",
    },
    notes: "皮・種は必ず除く。誤嚥注意",
  },

  // ─── 乳製品 ──────────────────────────────────────────────────────────────────
  {
    id: "yogurt",
    name: "プレーンヨーグルト",
    category: "dairy",
    subcategory: "乳製品",
    availableFrom: "early",
    allergyRisk: "specific",
    allergyNote: "乳成分",
    prep: {
      early: "少量そのまま（無糖）",
      mid: "そのまま（無糖）",
      late: "そのまま（無糖）",
      complete: "そのまま（無糖）",
    },
    notes: "無糖のものを選ぶ。加熱不要",
  },
  {
    id: "cottageCheese",
    name: "カッテージチーズ",
    category: "dairy",
    subcategory: "乳製品",
    availableFrom: "mid",
    allergyRisk: "specific",
    allergyNote: "乳成分",
    prep: {
      mid: "少量そのまま",
      late: "そのまま・料理に使う",
      complete: "そのまま・料理に使う",
    },
    notes: "塩分少ないものを選ぶ",
  },
  {
    id: "butter",
    name: "バター（無塩）",
    category: "dairy",
    subcategory: "乳製品",
    availableFrom: "mid",
    allergyRisk: "specific",
    allergyNote: "乳成分",
    prep: {
      mid: "少量を料理に（風味づけ程度）",
      late: "少量を料理に",
      complete: "少量を料理に",
    },
    notes: "無塩バターを使う",
  },

  // ─── だし・調味料 ─────────────────────────────────────────────────────────────
  {
    id: "kelpDashi",
    name: "昆布だし",
    category: "seasoning",
    subcategory: "だし",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "少量を風味づけに",
      mid: "少量を風味づけに",
      late: "だしとして使う",
      complete: "だしとして使う",
    },
    notes: "化学調味料不使用のものを",
  },
  {
    id: "katsuoDashi",
    name: "かつおだし",
    category: "seasoning",
    subcategory: "だし",
    availableFrom: "early",
    allergyRisk: "none",
    prep: {
      early: "少量を風味づけに",
      mid: "少量を風味づけに",
      late: "だしとして使う",
      complete: "だしとして使う",
    },
    notes: "化学調味料不使用のものを",
  },
];

/**
 * カテゴリ別に食材をグループ化する
 */
export function getFoodsByCategory(stage?: string): Record<string, FoodItem[]> {
  const stageOrder: Record<string, number> = {
    early: 0,
    mid: 1,
    late: 2,
    complete: 3,
  };
  const currentOrder = stage ? (stageOrder[stage] ?? 1) : 1;

  const filtered = FOODS.filter(
    (f) => stageOrder[f.availableFrom] <= currentOrder,
  );

  return filtered.reduce<Record<string, FoodItem[]>>((acc, food) => {
    if (!acc[food.category]) acc[food.category] = [];
    acc[food.category].push(food);
    return acc;
  }, {});
}
