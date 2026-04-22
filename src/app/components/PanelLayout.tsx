'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'

import Sidebar from './Sidebar'
import SortablePanel from './SortablePanel'
import type { Panel } from '../types'

const INITIAL_PANELS: Panel[] = [
  { id: 'map', label: 'Map', visible: true },
  { id: 'music', label: 'Music', visible: true },
  { id: 'chat', label: 'Chat', visible: true },
]

export default function PanelLayout() {
  const [panels, setPanels] = useState<Panel[]>(INITIAL_PANELS)
  const [activeId, setActiveId] = useState<Panel['id'] | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  )

  const handleClose = useCallback((id: Panel['id']) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: false } : p))
    )
  }, [])

  const handleToggle = useCallback((id: Panel['id']) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p))
    )
  }, [])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as Panel['id'])
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    if (!over || active.id === over.id) return

    setPanels((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id)
      const newIndex = prev.findIndex((p) => p.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }, [])

  const visiblePanels = panels.filter((p) => p.visible)
  const visibleIds = visiblePanels.map((p) => p.id)
  const activePanel = activeId ? panels.find((p) => p.id === activeId) : null

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar panels={panels} onToggle={handleToggle} />

      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          id="panel-dnd-context"
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={visibleIds} strategy={horizontalListSortingStrategy}>
            <div className="flex h-full min-w-full">
              {visiblePanels.map((panel) => (
                <SortablePanel
                  key={panel.id}
                  panel={panel}
                  onClose={handleClose}
                />
              ))}
            </div>
          </SortableContext>

          {/* 拖拽浮层：跟随鼠标的半透明副本 */}
          <DragOverlay>
            {activePanel ? (
              <div className="flex flex-col border border-gray-300 bg-white shadow-2xl opacity-90 h-full rounded-sm">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 cursor-grabbing select-none bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">{activePanel.label}</span>
                </div>
                <div className="flex-1" />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  )
}
