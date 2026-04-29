import { create } from 'zustand'

export type NodeType = 'model' | 'view' | 'viewset' | 'url_pattern' | 'form' | 'serializer' | 'admin' | 'signal' | 'function' | 'class' | 'file' | 'external'

interface FilterStore {
  activeLayer: string
  enabledNodeTypes: Set<NodeType>
  searchQuery: string
  toggleNodeType: (type: NodeType) => void
  setSearchQuery: (query: string) => void
  setLayer: (layer: string) => void
}

export const useFilterStore = create<FilterStore>((set) => ({
  activeLayer: 'full',
  enabledNodeTypes: new Set([
    'model',
    'view',
    'url_pattern',
    'form',
    'serializer',
    'admin',
    'signal',
    'function',
    'class',
    'file',
    'external'
  ]),
  searchQuery: '',
  toggleNodeType: (type) => set((state) => {
    const newSet = new Set(state.enabledNodeTypes)
    if (newSet.has(type)) {
      newSet.delete(type)
    } else {
      newSet.add(type)
    }
    return { enabledNodeTypes: newSet }
  }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setLayer: (layer) => set({ activeLayer: layer })
}))
