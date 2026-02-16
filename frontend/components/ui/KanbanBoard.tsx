'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ReactNode, useState } from 'react';

interface Column {
  id: string;
  title: string;
  items: any[];
}

interface KanbanBoardProps {
  columns: Column[];
  onDragEnd: (event: DragEndEvent) => void;
  renderCard: (item: any) => ReactNode;
  columnClassName?: string;
}

export function KanbanBoard({ columns, onDragEnd, renderCard, columnClassName }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <div key={column.id} className={columnClassName}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">{column.title}</h3>
              <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400">
                {column.items.length}
              </span>
            </div>
            <SortableContext items={column.items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {column.items.map((item) => renderCard(item))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeId ? renderCard(columns.flatMap(c => c.items).find(item => item.id === activeId)) : null}
      </DragOverlay>
    </DndContext>
  );
}
