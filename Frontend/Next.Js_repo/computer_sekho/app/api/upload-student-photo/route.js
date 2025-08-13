import fs from "fs";
import path from "path";

export const POST = async (req) => {
  const data = await req.formData();
  const file = data.get("photo");
  if (!file)
    return new Response(JSON.stringify({ error: "No file" }), { status: 400 });

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(process.cwd(), "public", "students", fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  return new Response(JSON.stringify({ path: `/students/${fileName}` }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
