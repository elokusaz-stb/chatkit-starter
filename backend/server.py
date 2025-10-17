from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv
import os

# Load .env for local dev (Render ignores this, but handy locally)
load_dotenv()

app = FastAPI()

# CORS: allow frontend origin
frontend_origin = os.getenv("CORS_ORIGINS", "https://chatkit-starter-1.onrender.com")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

class SessionRequest(BaseModel):
    user: str | None = "web-client"

@app.get("/")
def root():
    return {"status": "ok", "message": "ChatKit backend running"}

@app.post("/api/chatkit/session")
def create_chatkit_session(req: SessionRequest):
    """Create a ChatKit session linked to your workflow."""
    try:
        workflow_id = os.environ["WORKFLOW_ID"]
        print(f"🔗 Creating ChatKit session for workflow: {workflow_id}")

        session = openai.chatkit.sessions.create(
            workflow={"id": workflow_id},
            user=req.user,
        )

        print(f"✅ Session created: {session.id}")
        return {"client_secret": session.client_secret}

    except Exception as e:
        print("❌ Error creating ChatKit session:", str(e))
        return {"error": str(e)}
