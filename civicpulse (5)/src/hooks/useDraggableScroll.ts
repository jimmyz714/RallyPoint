import React, { useRef } from "react";

export function useDraggableScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const dragged = useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    isDown.current = true;
    dragged.current = false;
    startX.current = e.pageX - (ref.current?.offsetLeft || 0);
    scrollLeft.current = ref.current?.scrollLeft || 0;
  };

  const onMouseLeave = () => {
    isDown.current = false;
  };

  const onMouseUp = () => {
    isDown.current = false;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - (ref.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 10) dragged.current = true;
    if (ref.current) {
      ref.current.scrollLeft = scrollLeft.current - walk;
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (dragged.current) {
      e.stopPropagation();
      e.preventDefault();
      dragged.current = false;
    }
  };

  return { 
    ref, 
    onMouseDown, 
    onMouseLeave, 
    onMouseUp, 
    onMouseMove, 
    onClickCapture, 
    className: "no-scrollbar cursor-grab active:cursor-grabbing" 
  };
}
