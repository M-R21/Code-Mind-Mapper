import { useGraphStore } from '../store/graphStore'
import { motion, AnimatePresence } from 'framer-motion'

export function ProgressOverlay() {
  const { analysisStatus, analysisMessage, analysisProgress } = useGraphStore()

  return (
    <AnimatePresence>
      {analysisStatus === 'running' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm"
        >
          <div className="w-96 bg-bg-secondary border border-border rounded-lg shadow-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Analyzing Codebase</h3>
            
            <div className="w-full bg-bg-primary rounded-full h-2 mb-4 border border-border overflow-hidden">
              <motion.div 
                className="bg-blue-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress * 100}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">{analysisMessage}</span>
              <span className="text-text-muted font-mono">{Math.round(analysisProgress * 100)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
