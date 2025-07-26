from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:8001",
        "chrome-extension://ggofkpbiahekbnfnkjdnpgdkmknepife"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/track")
async def track_event(request: Request):
    data = await request.json()
    print(f"📥 Received Event: {data}")
    return {"status": "ok"}
