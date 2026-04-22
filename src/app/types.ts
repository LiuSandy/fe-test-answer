export type PanelId = 'map' | 'music' | 'chat'

export interface Panel {
  id: PanelId
  label: string
  visible: boolean
}
