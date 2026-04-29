const API_BASE = 'http://127.0.0.1:7731'

export const api = {
  async analyze(path: string) {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path,
        options: {
          exclude_patterns: ['__pycache__', '.git', 'node_modules', 'venv', '.venv', 'env', 'migrations'],
          include_migrations: false,
          max_depth: null,
          enable_call_graph: true,
          enable_type_inference: false,
          plugins: []
        }
      })
    })
    return res.json()
  },
  
  async getStatus(jobId: string) {
    const res = await fetch(`${API_BASE}/analyze/${jobId}/status`)
    return res.json()
  },

  async getResult(jobId: string) {
    const res = await fetch(`${API_BASE}/analyze/${jobId}/result`)
    return res.json()
  }
}
