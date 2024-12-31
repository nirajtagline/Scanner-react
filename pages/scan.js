import { useState } from "react";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleScan = async () => {
    setLoading(true);
    setResult("")
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
      });
      // const data = await response.json();
          // Get the response as a Blob
    const blob = await response.blob();

    // Create a URL for the Blob
    const blobUrl = URL.createObjectURL(blob);
      setResult(blobUrl);
    } catch (error) {
      setResult("Failed to scan document.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h1>Scan Document</h1>
      <button onClick={handleScan} disabled={loading}>
        {loading ? "Scanning..." : "Start Scan"}
      </button>
      {result && (
        <div>
          {/* <p>Result: {result}</p>
          {result.startsWith("/scanned-docs") && (
            <a href={result} download>
              Download Scanned Document
            </a>
          )} */}
           <a href={result} download>
              Download Scanned Document
            </a>
            
          <object
          data={result}
          type="application/pdf"
          width='100%'
          style={{display : "blob",minHeight:650}}
          >

          </object>
        </div>
      )}
    </div>
  );
}
