import { ChatKit, useChatKit } from '@openai/chatkit-react'

export function MyChat() {
const { control } = useChatKit({
api: {
async getClientSecret(existing?: string) {
// If 'existing' is provided, you could implement session refresh logic here.
const res = await fetch('http://localhost:5050/api/chatkit/session', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ device_id: crypto.randomUUID() }),
})
const { client_secret } = await res.json()
return client_secret
},
},
// Optional: theme & behavior (see docs for more)
// appearance: { theme: 'dark', accentColor: '#2563eb' },
})

return (
<div style={{ height: 640, width: 420, margin: '2rem auto' }}>
<ChatKit control={control} className="h-[640px] w-[420px]" />
</div>
)
}
