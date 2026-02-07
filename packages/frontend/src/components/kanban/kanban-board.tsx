"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface KanbanColumn<T> {
  id: string;
  title: string;
  color: string; // Tailwind border color class e.g. "border-green-500"
  items: T[];
}

export interface KanbanBoardProps<T extends { id: string }> {
  columns: KanbanColumn<T>[];
  renderCard: (item: T) => React.ReactNode;
  onDragEnd?: (itemId: string, fromColumn: string, toColumn: string) => void;
}

// ─── Droppable Column ────────────────────────────────────────────────────────

function DroppableColumn<T extends { id: string }>({
  column,
  renderCard,
}: {
  column: KanbanColumn<T>;
  renderCard: (item: T) => React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex min-w-[250px] flex-col">
      {/* Column header */}
      <div
        className={`mb-3 flex items-center justify-between rounded-t-lg border-t-4 bg-muted/50 px-3 py-2 ${column.color}`}
      >
        <h3 className="text-sm font-semibold">{column.title}</h3>
        <Badge variant="secondary" className="text-xs">
          {column.items.length}
        </Badge>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`flex min-h-[200px] flex-1 flex-col gap-2 rounded-b-lg border border-dashed p-2 transition-colors ${
          isOver ? "border-primary bg-primary/5" : "border-muted"
        }`}
      >
        <SortableContext
          items={column.items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.items.map((item) => renderCard(item))}
        </SortableContext>

        {column.items.length === 0 && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-xs text-muted-foreground">No items</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── KanbanBoard ─────────────────────────────────────────────────────────────

export function KanbanBoard<T extends { id: string }>({
  columns,
  renderCard,
  onDragEnd,
}: KanbanBoardProps<T>) {
  const [activeItem, setActiveItem] = useState<T | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  // Find which column an item belongs to
  const findColumnByItemId = useCallback(
    (itemId: string): KanbanColumn<T> | undefined => {
      return columns.find((col) => col.items.some((item) => item.id === itemId));
    },
    [columns],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const column = findColumnByItemId(active.id as string);
      if (column) {
        const item = column.items.find((i) => i.id === active.id);
        setActiveItem(item ?? null);
      }
    },
    [findColumnByItemId],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveItem(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find source column
      const fromColumn = findColumnByItemId(activeId);
      if (!fromColumn) return;

      // Determine target column: "over" could be a column id or another item id
      let toColumn = columns.find((col) => col.id === overId);
      if (!toColumn) {
        toColumn = findColumnByItemId(overId);
      }
      if (!toColumn) return;

      // Only fire callback if column actually changed
      if (fromColumn.id !== toColumn.id && onDragEnd) {
        onDragEnd(activeId, fromColumn.id, toColumn.id);
      }
    },
    [columns, findColumnByItemId, onDragEnd],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            renderCard={renderCard}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="rotate-2 opacity-90">{renderCard(activeItem)}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
