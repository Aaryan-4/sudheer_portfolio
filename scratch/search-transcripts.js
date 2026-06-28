import fs from "fs";
import readline from "readline";

async function search() {
  const fileStream = fs.createReadStream("C:/Users/shete/.gemini/antigravity/brain/a64d88a5-f07e-4d5d-934f-1cbd4c22290b/.system_generated/logs/transcript_full.jsonl");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log("Searching full transcripts...");

  for await (const line of rl) {
    // Look for pooler.supabase.com or supabase.co
    if (line.includes("pooler.supabase.com") || line.includes("supabase.co") || line.includes("DATABASE_URL")) {
      // Find first occurrence of "postgresql://"
      const idx = line.indexOf("postgresql://");
      if (idx !== -1) {
        console.log("FOUND DATABASE_URL:", line.substring(idx, idx + 150));
      }
    }
  }
}

search();
