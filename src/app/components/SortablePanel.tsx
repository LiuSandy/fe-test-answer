'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { XMarkIcon } from '@heroicons/react/24/outline'
import type { Panel } from '../types'

interface Props {
  panel: Panel
  onClose: (id: Panel['id']) => void
}

export default function SortablePanel({ panel, onClose }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: panel.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col flex-1 min-w-[280px] border-r border-gray-200 last:border-r-0"
    >
      {/* 可拖拽的顶部 header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 cursor-grab active:cursor-grabbing select-none bg-white"
        {...attributes}
        {...listeners}
      >
        <span className="text-sm font-medium text-gray-700">{panel.label}</span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onClose(panel.id)}
          className="p-0.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          aria-label={`关闭 ${panel.label}`}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 面板内容区 */}
      <div className="flex-1" />
    </div>
  )
}
