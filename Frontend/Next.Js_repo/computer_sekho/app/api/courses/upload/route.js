import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const coursesDir = path.join(process.cwd(), "public", "courses");
    if (!existsSync(coursesDir)) {
      await mkdir(coursesDir, { recursive: true });
    }

    const fileName = Date.now() + "-" + file.name.replace(/\s+/g, "_");
    const filePath = path.join(coursesDir, fileName);

    await writeFile(filePath, buffer);

    return new Response(JSON.stringify({ filePath: `/courses/${fileName}` }), {
      status: 200,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}
