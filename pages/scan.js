import { useState } from "react";

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/scan", {
        method: "POST",
      });
      const data = await response.json();
      setResult(data.file || "Scan successful!");
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
          <p>Result: {result}</p>
          {result.startsWith("/scanned-docs") && (
            <a href={result} download>
              Download Scanned Document
            </a>
          )}
        </div>
      )}
    </div>
  );
}
