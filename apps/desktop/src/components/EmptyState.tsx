import { FolderOpen } from 'lucide-react'
import { useGraphStore } from '../store/graphStore'
import { api } from '../lib/api'

export function EmptyState() {
  const { setGraph, setAnalysisStatus } = useGraphStore()

  const handleOpenFolder = async () => {
    let folderPath = '';
    // @ts-ignore
    if (window.electronAPI) {
      // @ts-ignore
      folderPath = await window.electronAPI.openDirectory();
    } else {
      // Fallback for browser testing
      folderPath = './engine/tests/fixtures/django_blog';
    }
    
    if (!folderPath) return
    
    setAnalysisStatus('running', 0.1, 'Queuing analysis...')
    try {
      const res = await api.analyze(folderPath)
      const jobId = res.job_id
      
      const poll = setInterval(async () => {
        const status = await api.getStatus(jobId)
        setAnalysisStatus(status.status, status.progress, status.message)
        
        if (status.status === 'done') {
          clearInterval(poll)
          const result = await api.getResult(jobId)
          setGraph(result)
        } else if (status.status === 'error') {
          clearInterval(poll)
        }
      }, 500)
    } catch (err: any) {
      setAnalysisStatus('error', 0, err.message)
    }
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-primary">
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-full bg-bg-secondary border border-border">
          <div className="text-4xl text-text-primary">⬡</div>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Cortex</h1>
        <p className="text-text-secondary mb-8">Drop a project folder here, or click to browse</p>
        
        <button 
          onClick={handleOpenFolder}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
        >
          <FolderOpen size={18} />
          <span>Open Project</span>
        </button>
      </div>
    </div>
  )
}
