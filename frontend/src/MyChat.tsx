import { useEffect, useState } from "react";
import { ChatKit } from "@openai/chatkit/react";

export default function MyChat() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "https://chatkit-starter.onrender.com";

  console.log("Backend URL:", backendUrl);

  useEffect(() => {
    async function initSession() {
      try {
        console.log("🟡 Creating ChatKit session...");
        const res = await fetch(`${backendUrl}/api/chatkit/session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: "frontend-test" }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (data.client_secret) {
          console.log("✅ Got client_secret:", data.client_secret.slice(0, 15) + "...");
          setClientSecret(data.client_secret);
        } else {
          console.error("❌ No client_secret returned:", data);
        }
      } catch (err) {
        console.error("🔥 Error fetching ChatKit session:", err);
      }
    }

    initSession();
  }, []);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Connecting to agent...
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md h-[600px] border border-gray-200 rounded-xl shadow-md overflow-hidden">
        <ChatKit
          clientSecret={clientSecret}
          appearance={{
            theme: "light",
          }}
        />
      </div>
    </div>
  );
}
