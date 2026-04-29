import { create } from 'zustand'

export interface GraphStore {
  graph: any | null
  selectedNodeId: string | null
  hoveredNodeId: string | null
  activeAnalysisId: string | null
  analysisStatus: 'idle' | 'queued' | 'running' | 'done' | 'error'
  analysisProgress: number
  analysisMessage: string
  setGraph: (graph: any) => void
  selectNode: (id: string | null) => void
  setAnalysisStatus: (status: any, progress: number, message: string) => void
}

export const useGraphStore = create<GraphStore>((set) => ({
  graph: null,
  selectedNodeId: null,
  hoveredNodeId: null,
  activeAnalysisId: null,
  analysisStatus: 'idle',
  analysisProgress: 0,
  analysisMessage: '',
  setGraph: (graph) => set({ graph, analysisStatus: 'done', analysisProgress: 1, analysisMessage: 'Done' }),
  selectNode: (id) => set({ selectedNodeId: id }),
  setAnalysisStatus: (status, progress, message) => set({ analysisStatus: status, analysisProgress: progress, analysisMessage: message })
}))
