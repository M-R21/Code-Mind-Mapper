from pydantic import BaseModel

class AnalysisOptions(BaseModel):
    exclude_patterns: list[str] = []
    include_migrations: bool = False
    max_depth: int | None = None
    enable_call_graph: bool = True
    enable_type_inference: bool = False
    plugins: list[str] = []

class AnalyzeRequest(BaseModel):
    path: str
    options: AnalysisOptions

class JobStatusResponse(BaseModel):
    status: str
    progress: float
    message: str
