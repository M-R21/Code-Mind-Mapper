import { useGraphStore } from '../store/graphStore'

export function StatusBar() {
  const { graph } = useGraphStore()
  
  if (!graph) {
    return (
      <div className="h-6 bg-bg-primary border-t border-border flex items-center px-4 text-xs text-text-muted z-50">
        Ready
      </div>
    )
  }

  return (
    <div className="h-6 bg-bg-primary border-t border-border flex items-center justify-between px-4 text-xs text-text-muted z-50 select-none">
      <div className="flex space-x-4">
        <span>{graph.meta.nodeCount} nodes</span>
        <span>{graph.meta.edgeCount} edges</span>
        <span>{graph.meta.fileCount} files</span>
      </div>
      <div className="flex space-x-4">
        {graph.meta.warnings.length > 0 && (
          <span className="text-yellow-500">⚠ {graph.meta.warnings.length} warnings</span>
        )}
        <span className="capitalize">{graph.meta.framework}</span>
        <span>{graph.meta.analysisDurationMs}ms</span>
      </div>
    </div>
  )
}
