import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cortex.api.routes import router
from cortex.plugins.registry import registry
from cortex.plugins.universal import UniversalPlugin
from cortex.plugins.django_plugin import DjangoPlugin

app = FastAPI(title="Cortex Analysis Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# Ensure plugins are registered before app starts
registry.register(UniversalPlugin())
registry.register(DjangoPlugin())

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=7731, reload=True)
