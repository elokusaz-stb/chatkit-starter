from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os

load_dotenv()

app = FastAPI()

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
if origins:
app.add_middleware(
CORSMiddleware,
allow_origins=origins,
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"]) # server-side key
WORKFLOW_ID = os.environ["WORKFLOW_ID"]

class SessionRequest(BaseModel):
device_id: str | None = None

@app.post("/api/chatkit/session")
async def create_chatkit_session(payload: SessionRequest):
"""
Creates a ChatKit session and returns the short‑lived client_secret
the browser needs to open/refresh the session.
"""
# You can pass optional user metadata here if needed
session = client.beta.chatkit.sessions.create(
workflow={"id": WORKFLOW_ID},
user=payload.device_id or "anon",
# Optional runtime tweaks (see docs):
# chatkit_configuration={
# "file_upload": {"enabled": True},
# }
)

return {"client_secret": session.client_secret}

# Local dev entry
# uvicorn backend.server:app --reload --port 5050
