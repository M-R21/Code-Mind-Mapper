import { Settings, FolderOpen, History } from 'lucide-react'
import { api } from '../lib/api'
import { useGraphStore } from '../store/graphStore'

export function TitleBar() {
  const { setGraph, setAnalysisStatus } = useGraphStore()

  const handleOpenFolder = async () => {
    let folderPath = '';
    // @ts-ignore
    if (window.electronAPI) {
      // @ts-ignore
      folderPath = await window.electronAPI.openDirectory();
    } else {
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
    <div className="h-12 bg-bg-secondary/90 border-b border-border/70 flex items-center justify-between px-4 drag-region select-none relative z-50 backdrop-blur-sm">
      <div className="flex items-center space-x-4 pl-16">
        <span className="font-semibold tracking-wide text-sm text-text-primary">CORTEX</span>
      </div>
      <div className="flex items-center space-x-2 no-drag-region">
        <button onClick={handleOpenFolder} className="p-1.5 hover:bg-bg-elevated rounded-md text-text-secondary hover:text-text-primary transition-colors">
          <FolderOpen size={16} />
        </button>
        <button className="p-1.5 hover:bg-bg-elevated rounded-md text-text-secondary hover:text-text-primary transition-colors">
          <History size={16} />
        </button>
        <button className="p-1.5 hover:bg-bg-elevated rounded-md text-text-secondary hover:text-text-primary transition-colors">
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
