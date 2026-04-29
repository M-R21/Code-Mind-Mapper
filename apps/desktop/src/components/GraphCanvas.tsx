import { useEffect, useRef } from 'react'
import cytoscape from 'cytoscape'
import dagre from 'cytoscape-dagre'
import coseBilkent from 'cytoscape-cose-bilkent'
import { useGraphStore } from '../store/graphStore'
import { useFilterStore } from '../store/filterStore'
import { useUiStore } from '../store/uiStore'
import { cytoscapeStylesheet } from '../lib/cytoscapeStyles'

cytoscape.use(dagre)
cytoscape.use(coseBilkent)

export function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<cytoscape.Core | null>(null)
  const { graph, selectNode, selectedNodeId } = useGraphStore()
  const { enabledNodeTypes, searchQuery } = useFilterStore()
  const { setDetailPanelOpen } = useUiStore()

  // Initialize graph
  useEffect(() => {
    if (!containerRef.current || !graph) return

    let elements: any = []
    if (Array.isArray(graph?.nodes) && Array.isArray(graph?.edges)) {
      const nodeIds = new Set(graph.nodes.map((n: any) => n?.data?.id).filter(Boolean))
      const edges = graph.edges.filter((e: any) => {
        const src = e?.data?.source
        const tgt = e?.data?.target
        return src && tgt && nodeIds.has(src) && nodeIds.has(tgt)
      })
      elements = { nodes: graph.nodes, edges }
    }

    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: cytoscapeStylesheet,
      layout: {
        name: 'breadthfirst',
        directed: true,
        circle: true,
        spacingFactor: 1.8,
        padding: 80,
        nodeDimensionsIncludeLabels: true,
        avoidOverlap: true,
        fit: true,
        animate: false,
      },
      wheelSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 5,
    })

    const cy = cyRef.current
    cy.fit(undefined, 40)

    cy.on('tap', 'node', (evt) => {
      const node = evt.target
      selectNode(node.id())
      setDetailPanelOpen(true)
      
      // Dimming logic
      cy.elements().removeClass('dimmed')
      const neighborhood = node.neighborhood()
      cy.elements().difference(neighborhood).difference(node).addClass('dimmed')
    })

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        selectNode(null)
        setDetailPanelOpen(false)
        cy.elements().removeClass('dimmed')
      }
    })

    cy.on('dblclick', 'node', async (evt) => {
      const node = evt.target
      const path = node.data('filePath')
      const line = node.data('lineStart')
      if (path && window.electronAPI) {
        await window.electronAPI.openEditor(path, line)
      }
    })

    return () => {
      cy.destroy()
    }
  }, [graph])

  // Apply filters
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.batch(() => {
      cy.nodes().forEach(node => {
        let visible = enabledNodeTypes.has(node.data('nodeType'))
        
        if (searchQuery && visible) {
          const lbl = node.data('label') || ''
          visible = lbl.toLowerCase().includes(searchQuery.toLowerCase())
        }

        if (visible) {
          node.removeClass('hidden')
        } else {
          node.addClass('hidden')
        }
      })
    })
  }, [enabledNodeTypes, searchQuery])

  // Highlight connections for the selected node
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return

    cy.batch(() => {
      cy.elements().removeClass('highlighted')
      cy.elements().removeClass('dimmed')

      if (!selectedNodeId) return

      const node = cy.getElementById(selectedNodeId)
      if (!node || node.empty()) return

      const connectedEdges = node.connectedEdges()
      const connectedNodes = connectedEdges.connectedNodes()

      node.addClass('highlighted')
      connectedEdges.addClass('highlighted')
      connectedNodes.addClass('highlighted')

      const neighborhood = node.neighborhood()
      cy.elements().difference(neighborhood).difference(node).addClass('dimmed')
    })

    if (selectedNodeId) {
      const node = cy.getElementById(selectedNodeId)
      if (node && !node.empty()) {
        cy.animate({ center: { eles: node }, duration: 200 })
      }
    }
  }, [selectedNodeId])

  return (
    <div className="absolute inset-0 p-4">
      <div id="cy-container" ref={containerRef} />
    </div>
  )
}
