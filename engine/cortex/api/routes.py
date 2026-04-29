import uuid
import dataclasses
from fastapi import APIRouter, BackgroundTasks, HTTPException
from .schemas import AnalyzeRequest, JobStatusResponse
from ..orchestrator import AnalysisOrchestrator

router = APIRouter()

# Simple in-memory store for jobs
jobs = {}

def run_analysis_task(job_id: str, request: AnalyzeRequest):
    jobs[job_id]["status"] = "running"
    jobs[job_id]["progress"] = 0.1
    jobs[job_id]["message"] = "Scanning files..."
    
    try:
        orchestrator = AnalysisOrchestrator()
        graph = orchestrator.analyze(request.path, request.options.model_dump())
        jobs[job_id]["status"] = "done"
        jobs[job_id]["progress"] = 1.0
        jobs[job_id]["message"] = "Done"
        jobs[job_id]["result"] = dataclasses.asdict(graph)
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["message"] = str(e)

@router.post("/analyze")
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "status": "queued",
        "progress": 0.0,
        "message": "Queued",
        "result": None
    }
    background_tasks.add_task(run_analysis_task, job_id, request)
    return {"job_id": job_id}

@router.get("/analyze/{job_id}/status", response_model=JobStatusResponse)
async def get_status(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    job = jobs[job_id]
    return JobStatusResponse(
        status=job["status"],
        progress=job["progress"],
        message=job["message"]
    )

@router.get("/analyze/{job_id}/result")
async def get_result(job_id: str):
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    job = jobs[job_id]
    if job["status"] != "done":
        raise HTTPException(status_code=400, detail="Job not finished")
    return job["result"]
