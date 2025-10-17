import { ChatKit, useChatKit } from "@openai/chatkit-react";
import React, { useEffect, useState } from "react";

export function MyChat() {
  const [error, setError] = useState<string | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    console.log("Backend URL:", backendUrl);
  }, [backendUrl]);

  const { control } = useChatKit({
    api: {
      async getClientSecret(currentClientSecret: string | null): Promise<string> {
        const sessionUrl = `${backendUrl}/api/chatkit/session`;
        console.log("Fetching client secret from:", sessionUrl);

        try {
          const res = await fetch(sessionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id: crypto.randomUUID() }),
          });

          if (!res.ok) {
            const msg = `Failed to fetch client secret: ${res.status} ${res.statusText}`;
            console.error(msg);
            setError(msg);
            throw new Error(msg);
          }

          const data = await res.json();
          const client_secret = data?.client_secret;

          if (!client_secret) {
            setError("❌ No client_secret returned from backend");
            throw new Error("No client_secret in response");
          }

          console.log("✅ Received client_secret");
          setError(null);
          return client_secret;
        } catch (err) {
          console.error("Error fetching client secret:", err);
          setError("⚠️ Could not connect to backend — check console logs.");
          throw err;
        }
      },
    },
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
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fafafa",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {error ? (
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "#b91c1c",
            fontFamily: "sans-serif",
            fontSize: "0.95rem",
          }}
        >
          <p>{error}</p>
          <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            (Backend URL: {backendUrl})
          </p>
        </div>
      ) : (
        <ChatKit control={control} className="h-[640px] w-[420px]" />
      )}
    </div>
  );
}
