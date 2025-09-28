"use client"

import { useEffect } from "react"
import toast from "react-hot-toast";
import { getRandomOrder } from "@/lib/random-order-generator"

export function OrderToasts() {
  
  useEffect(() => {
    function showRandomToast() {
      toast(`New Order\n ${getRandomOrder()}`,{
        duration: 4000,
        icon:'🎉',
        iconTheme: {
          primary: '#000',
          secondary: '#fff',
        },
        position: "bottom-left",
      })
    }

    // keep showing every 30–90s
    const interval = setInterval(showRandomToast, Math.random() * (90000 - 30000) + 30000)

    return () => {
      clearInterval(interval)
    }
  }, [toast])

  return null
}
