import { useGraphStore } from '../store/graphStore'
import { useUiStore } from '../store/uiStore'
import { nodeColors } from '../lib/nodeColors'
import { ExternalLink } from 'lucide-react'

export function DetailPanel() {
  const { graph, selectedNodeId, selectNode } = useGraphStore()
  const { setDetailPanelOpen } = useUiStore()
  
  if (!selectedNodeId || !graph) return null
  
  const node = graph.nodes.find((n: any) => n.data.id === selectedNodeId)?.data
  if (!node) return null

  const edges = graph.edges || []
  const nodeById = new Map(graph.nodes.map((n: any) => [n.data.id, n.data]))
  const connections = edges
    .filter((e: any) => e.data.source === selectedNodeId || e.data.target === selectedNodeId)
    .map((e: any) => {
      const isOutgoing = e.data.source === selectedNodeId
      const otherId = isOutgoing ? e.data.target : e.data.source
      const other = nodeById.get(otherId)
      return {
        id: e.data.id,
        direction: isOutgoing ? 'out' : 'in',
        edgeType: e.data.edgeType || 'link',
        label: other?.label || otherId,
        path: other?.filePath || otherId,
        nodeId: otherId
      }
    })

  const handleOpenEditor = async () => {
    if (window.electronAPI) {
      await window.electronAPI.openEditor(node.filePath, node.lineStart)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border bg-bg-primary/50">
        <div className="flex items-center space-x-2 mb-2">
          <span 
            className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border"
            style={{ 
              color: nodeColors[node.nodeType], 
              borderColor: `${nodeColors[node.nodeType]}40`,
              backgroundColor: `${nodeColors[node.nodeType]}10`
            }}
          >
            {node.nodeType}
          </span>
        </div>
        <h2 className="text-lg font-mono font-medium truncate mb-1">{node.label}</h2>
        <div className="text-xs text-text-muted font-mono truncate flex items-center group cursor-pointer hover:text-text-secondary" onClick={handleOpenEditor}>
          <span>{node.filePath ? `${node.filePath.split('/').pop()} · L${node.lineStart}` : 'External module'}</span>
          <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100" />
        </div>
        {node.filePath && (
          <div className="text-[10px] text-text-muted font-mono break-all mt-1">{node.filePath}</div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-sm">
        {node.docstring && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Docstring</h3>
            <div className="text-text-secondary bg-bg-primary p-3 rounded-md border border-border whitespace-pre-wrap font-mono text-xs">
              {node.docstring}
            </div>
          </div>
        )}
        
        {node.metadata?.bases && node.metadata.bases.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Inherits</h3>
            <div className="flex flex-wrap gap-2">
              {node.metadata.bases.map((b: string) => (
                <span key={b} className="px-2 py-1 bg-bg-primary border border-border rounded text-xs font-mono">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {node.decorators && node.decorators.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Decorators</h3>
            <div className="flex flex-wrap gap-2">
              {node.decorators.map((d: string) => (
                <span key={d} className="px-2 py-1 bg-bg-primary border border-border rounded text-xs font-mono text-node-function">
                  @{d}
                </span>
              ))}
            </div>
          </div>
        )}

        {connections.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Connections</h3>
            <div className="space-y-2">
              {connections.map((c: any) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    selectNode(c.nodeId)
                    setDetailPanelOpen(true)
                  }}
                  className="w-full text-left bg-bg-primary border border-border rounded p-2 hover:bg-bg-elevated/60 transition-colors"
                >
                  <div className="text-xs text-text-secondary">
                    <span className="font-mono">{c.direction === 'out' ? '->' : '<-'}</span>
                    <span className="ml-2">{c.edgeType}</span>
                  </div>
                  <div className="text-sm font-mono truncate">{c.label}</div>
                  {c.path && (
                    <div className="text-[10px] text-text-muted font-mono break-all">{c.path}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-2">Metrics</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-bg-primary border border-border rounded p-2 text-center">
              <div className="text-lg font-semibold">{node.complexity}</div>
              <div className="text-[10px] text-text-muted uppercase">Complexity</div>
            </div>
            <div className="bg-bg-primary border border-border rounded p-2 text-center">
              <div className="text-lg font-semibold">{node.degree}</div>
              <div className="text-[10px] text-text-muted uppercase">Connections</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
