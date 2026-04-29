import { useEffect } from 'react'
import { TitleBar } from './components/TitleBar'
import { Sidebar } from './components/Sidebar'
import { GraphCanvas } from './components/GraphCanvas'
import { DetailPanel } from './components/DetailPanel'
import { StatusBar } from './components/StatusBar'
import { ProgressOverlay } from './components/ProgressOverlay'
import { EmptyState } from './components/EmptyState'
import { useGraphStore } from './store/graphStore'
import { useUiStore } from './store/uiStore'

function App() {
  const { graph } = useGraphStore()
  const { sidebarOpen, detailPanelOpen } = useUiStore()

  return (
    <div className="flex flex-col h-screen w-screen bg-bg-primary text-text-primary overflow-hidden font-sans select-none">
      <TitleBar />
      
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-64 bg-bg-secondary/95 border-r border-border/70 flex flex-col z-10 shadow-2xl backdrop-blur-sm">
            <Sidebar />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {!graph ? (
            <EmptyState />
          ) : (
            <GraphCanvas />
          )}
        </div>

        {/* Detail Panel */}
        {detailPanelOpen && graph && (
          <div className="w-80 bg-bg-secondary/95 border-l border-border/70 flex flex-col z-10 shadow-2xl backdrop-blur-sm">
            <DetailPanel />
          </div>
        )}
      </div>

      <StatusBar />
      <ProgressOverlay />
    </div>
  )
}

export default App
