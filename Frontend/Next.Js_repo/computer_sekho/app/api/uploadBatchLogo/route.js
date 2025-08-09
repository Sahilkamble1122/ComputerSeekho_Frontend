import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Buffer me convert karo
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload folder ensure karo
    const uploadDir = path.join(process.cwd(), "public", "batches");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Unique filename banao
    const timestamp = Date.now();
    const ext = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random()
      .toString(36)
      .substring(2, 8)}.${ext}`;

    // Save karo file
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Return relative path jo frontend me use hoga
    return NextResponse.json({ path: `/batches/${fileName}` });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
