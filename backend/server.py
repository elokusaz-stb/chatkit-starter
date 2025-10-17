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

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
WORKFLOW_ID = os.environ["WORKFLOW_ID"]

class SessionRequest(BaseModel):
device_id: str | None = None

@app.post("/api/chatkit/session")
async def create_chatkit_session(payload: SessionRequest):
session = client.beta.chatkit.sessions.create(
workflow={"id": WORKFLOW_ID},
user=payload.device_id or "anon",
)
return {"client_secret": session.client_secret}
