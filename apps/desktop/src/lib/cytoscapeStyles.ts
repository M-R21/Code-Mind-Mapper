import { nodeColors } from './nodeColors'

export const cytoscapeStylesheet: any = [
  {
    selector: 'node',
    style: {
      'background-color': (ele: any) => nodeColors[ele.data('nodeType')] || '#64748b',
      'label': 'data(label)',
      'color': '#e8e9eb',
      'font-size': 11,
      'font-family': '"Berkeley Mono", "JetBrains Mono", monospace',
      'text-valign': 'center',
      'text-halign': 'center',
      'text-max-width': 140,
      'text-wrap': 'wrap',
      'text-background-color': '#0f1115',
      'text-background-opacity': 0.85,
      'text-background-padding': 2,
      'text-background-shape': 'round-rectangle',
      'width': (ele: any) => 20 + Math.min((ele.data('degree') || 0) * 2, 40),
      'height': (ele: any) => 20 + Math.min((ele.data('degree') || 0) * 2, 40),
      'padding': 8,
      'shape': 'round-rectangle',
      'border-width': 1.5,
      'border-color': '#2a2c30',
      'border-opacity': 0.6,
      'background-opacity': 0.95,
    }
  },
  {
    selector: 'node[nodeType = "file"]',
    style: {
      'font-size': 9,
    }
  },
  {
    selector: 'node[nodeType = "external"]',
    style: {
      'border-style': 'dashed',
      'border-color': '#4b5563',
      'color': '#b0b3ba',
      'background-color': '#1b1d21',
    }
  },
  {
    selector: 'node:selected',
    style: {
      'border-width': 3,
      'border-color': '#ffffff',
      'border-opacity': 1,
    }
  },
  {
    selector: 'node.highlighted',
    style: {
      'border-width': 3,
      'border-color': '#e2e8f0',
      'border-opacity': 1,
      'shadow-blur': 12,
      'shadow-color': '#38bdf8',
      'shadow-opacity': 0.35,
    }
  },
  {
    selector: 'node.dimmed',
    style: { 'opacity': 0.2 }
  },
  {
    selector: 'node.hidden',
    style: { 'display': 'none' }
  },
  {
    selector: 'edge',
    style: {
      'width': 1.1,
      'line-color': '#3b3f49',
      'target-arrow-color': '#3b3f49',
      'target-arrow-shape': 'none',
      'arrow-scale': 0.8,
      'curve-style': 'bezier',
      'opacity': 0.45,
    }
  },
  {
    selector: 'edge.highlighted',
    style: {
      'width': 2.4,
      'line-color': '#38bdf8',
      'target-arrow-color': '#38bdf8',
      'opacity': 0.95,
    }
  },
  {
    selector: 'edge.dimmed',
    style: { 'opacity': 0.05 }
  },
  {
    selector: 'edge.hidden',
    style: { 'display': 'none' }
  }
]
