'use client'

import {
  MapIcon,
  MusicalNoteIcon,
  ChatBubbleBottomCenterIcon,
} from '@heroicons/react/24/outline'
import type { Panel } from '../types'

const ICON_MAP: Record<Panel['id'], React.ElementType> = {
  map: MapIcon,
  music: MusicalNoteIcon,
  chat: ChatBubbleBottomCenterIcon,
}

interface Props {
  panels: Panel[]
  onToggle: (id: Panel['id']) => void
}

export default function Sidebar({ panels, onToggle }: Props) {
  return (
    <aside className="flex flex-col items-center w-16 border-r border-gray-200 flex-shrink-0 py-2 gap-1">
      {panels.map((panel) => {
        const Icon = ICON_MAP[panel.id]
        return (
          <button
            key={panel.id}
            onClick={() => onToggle(panel.id)}
            className={`flex flex-col items-center gap-0.5 w-full py-2 rounded transition-colors
              ${panel.visible
                ? 'text-gray-800 hover:bg-gray-100'
                : 'text-gray-300 hover:bg-gray-50'
              }`}
            title={panel.label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px]">{panel.label}</span>
          </button>
        )
      })}
    </aside>
  )
}
