"use client"

import { useEffect, useRef } from "react"

export function PremiumCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only on pointer-capable devices
    if (!window.matchMedia("(pointer: fine)").matches) return

    let raf: number
    let mx = -100, my = -100   // dot  — instant
    let rx = -100, ry = -100   // ring — lagged

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
    }
    window.addEventListener("mousemove", onMove, { passive: true })

    const tick = () => {
      // Dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`
        dotRef.current.style.top  = `${my}px`
      }
      // Ring interpolates (lerp factor 0.12 → smooth lag)
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`
        ringRef.current.style.top  = `${ry}px`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div id="cursor-dot"  ref={dotRef}  aria-hidden />
      <div id="cursor-ring" ref={ringRef} aria-hidden />
    </>
  )
}
