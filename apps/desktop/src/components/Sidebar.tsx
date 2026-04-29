import { useFilterStore, NodeType } from '../store/filterStore'
import { nodeColors } from '../lib/nodeColors'

const ALL_NODE_TYPES: {type: NodeType, label: string}[] = [
  { type: 'model', label: 'Models' },
  { type: 'view', label: 'Views' },
  { type: 'url_pattern', label: 'URLs' },
  { type: 'form', label: 'Forms' },
  { type: 'serializer', label: 'Serializers' },
  { type: 'admin', label: 'Admin' },
  { type: 'signal', label: 'Signals' },
  { type: 'function', label: 'Functions' },
  { type: 'class', label: 'Classes' },
  { type: 'file', label: 'Files' },
  { type: 'external', label: 'External' },
]

export function Sidebar() {
  const { enabledNodeTypes, toggleNodeType, activeLayer, setLayer, searchQuery, setSearchQuery } = useFilterStore()

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto custom-scrollbar">
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search nodes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-bg-elevated border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-text-muted"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">Graph Layers</h3>
        <div className="space-y-2">
          {['full', 'imports', 'inheritance'].map(layer => (
            <label key={layer} className="flex items-center space-x-2 text-sm cursor-pointer">
              <input 
                type="radio" 
                name="layer" 
                checked={activeLayer === layer}
                onChange={() => setLayer(layer)}
                className="accent-bg-elevated"
              />
              <span className="capitalize">{layer} Graph</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xs uppercase tracking-wider text-text-muted font-semibold mb-3">Node Types</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_NODE_TYPES.map(nt => {
            const isActive = enabledNodeTypes.has(nt.type)
            return (
              <button
                key={nt.type}
                onClick={() => toggleNodeType(nt.type)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors flex items-center space-x-1.5`}
                style={{
                  backgroundColor: isActive ? `${nodeColors[nt.type]}20` : 'transparent',
                  borderColor: isActive ? nodeColors[nt.type] : '#2a2c30',
                  color: isActive ? '#e8e9eb' : '#8b8d94'
                }}
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nodeColors[nt.type] }} />
                <span>{nt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
