import { ChatKit, useChatKit } from "@openai/chatkit-react";

export function MyChat() {
  const { control } = useChatKit({
    api: {
      async getClientSecret(currentClientSecret: string | null): Promise<string> {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/chatkit/session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ device_id: crypto.randomUUID() })
          }
        );
        const { client_secret } = await res.json();
        return client_secret;
      }
    }
  });

  return (
    <div style={{ height: 640, width: 420, margin: "2rem auto" }}>
      <ChatKit control={control} className="h-[640px] w-[420px]" />
    </div>
  );
}
