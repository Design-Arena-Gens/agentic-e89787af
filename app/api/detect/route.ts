import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const CLARIFAI_MODEL_ID = "food-item-recognition";
const CLARIFAI_API_URL = `https://api.clarifai.com/v2/models/${CLARIFAI_MODEL_ID}/outputs`;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!SUPPORTED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload JPG, PNG, or WEBP." },
        { status: 400 }
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const clarifaiKey = process.env.CLARIFAI_PAT;
    if (!clarifaiKey) {
      return NextResponse.json(
        { error: "Clarifai credentials are not configured." },
        { status: 500 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const response = await fetch(CLARIFAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${clarifaiKey}`
      },
      body: JSON.stringify({
        inputs: [
          {
            data: {
              image: {
                base64
              }
            }
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Clarifai request failed.", details: error },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as ClarifaiResponse;
    const candidates = payload.outputs?.[0]?.data?.concepts ?? [];
    const ingredients = candidates
      .filter((concept) => concept.value >= 0.75)
      .slice(0, 8)
      .map((concept) => concept.name.toLowerCase());

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error("Image detection error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while processing image." },
      { status: 500 }
    );
  }
}

interface ClarifaiResponse {
  outputs?: Array<{
    data?: {
      concepts?: Array<{
        id: string;
        name: string;
        value: number;
      }>;
    };
  }>;
}
