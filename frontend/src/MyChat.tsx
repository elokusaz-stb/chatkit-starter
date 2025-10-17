import { ChatKit, useChatKit } from "@openai/chatkit-react";
import React, { useEffect } from "react";

export function MyChat() {
  // Log environment variable on mount
  useEffect(() => {
    console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);
  }, []);

  const { control } = useChatKit({
    api: {
      // Called when ChatKit needs a client secret
      async getClientSecret(currentClientSecret: string | null): Promise<string> {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        console.log("Fetching client secret from:", `${backendUrl}/api/chatkit/session`);

        try {
          const res = await fetch(`${backendUrl}/api/chatkit/session`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id: crypto.randomUUID() })
          });

          if (!res.ok) {
            console.error("Failed to fetch client secret:", res.status, res.statusText);
            throw new Error(`Backend returned ${res.status}`);
          }

          const { client_secret } = await res.json();

          console.log("Received client_secret:", client_secret ? "✅ exists" : "❌ missing");
          return client_secret;
        } catch (error) {
          console.error("Error fetching client secret:", error);
          throw error;
        }
      }
    }
  });

  return (
    <div
      style={{
        height: 640,
        width: 420,
        margin: "2rem auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #ccc",
        borderRadius: "12px",
        background: "#fafafa"
      }}
    >
      <ChatKit control={control} className="h-[640px] w-[420px]" />
    </div>
  );
}
