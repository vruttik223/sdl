'use client'

import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 1024
    if (isMobile) return

    // const lenis = new Lenis({
    //   duration: 1.1,
    //   easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    //   smoothWheel: true,
    //   smoothTouch: false,
    // })

    const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        smoothTouch: false,
      })
      // console.log(lenis, 'lenis')

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
