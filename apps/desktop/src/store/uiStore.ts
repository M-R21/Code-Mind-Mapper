import { create } from 'zustand'

interface UiStore {
  sidebarOpen: boolean
  detailPanelOpen: boolean
  toggleSidebar: () => void
  toggleDetailPanel: () => void
  setDetailPanelOpen: (open: boolean) => void
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarOpen: true,
  detailPanelOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDetailPanel: () => set((state) => ({ detailPanelOpen: !state.detailPanelOpen })),
  setDetailPanelOpen: (open) => set({ detailPanelOpen: open })
}))
