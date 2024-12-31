import { scanDocument } from '../../lib/dist/index.esm'; // Adjust path based on your actual folder structure

// import path from "path";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const outputPath = path.resolve("public/scanned-docs/document.pdf");
//       const message = await scanDocument(outputPath, {
//         format: "pdf",
//         dpi: 300,
//       });
//       res.status(200).json({ message, file: "/scanned-docs/document.pdf" });
//     } catch (error) {
//       res.status(500).json({ error: error.toString() });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }


import path from "path";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const outputPath = path.resolve("public/scanned-docs/document.pdf");

//       // Call scanDocument to scan the document
//       const message = await scanDocument(outputPath, {
//         format: "pdf",
//         dpi: 300,
//       });

//       // Return the success message along with the file path
//       res.status(200).json({ message, file: "/scanned-docs/document.pdf" });
//     } catch (error) {
//       // If an error occurs, return the error message
//       res.status(500).json({ error: error.toString() });
//     }
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }


// import { scanDocument } from "niraj-1";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Scan the document and get the file as a Buffer
      const fileBuffer = await scanDocument({
        format: "pdf",
        dpi: 300,
      });

      // Set headers for downloading the file
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="scanned-document.pdf"');

      // Send the file buffer as the response
      res.status(200).send(fileBuffer);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
