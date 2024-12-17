import  {scanDocument}  from "niraj-1";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const outputPath = path.resolve("public/scanned-docs/document.pdf");
      const message = await scanDocument(outputPath, {
        format: "pdf",
        dpi: 300,
      });
      res.status(200).json({ message, file: "/scanned-docs/document.pdf" });
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
