"use client"

import { useState } from "react"

export default function ProductTabs({
  description,
  shipping,
  care,
}: {
  description: string
  shipping: string
  care: string
}) {
  const [active, setActive] = useState("description")
  const tabs = [
    { key: "description", label: "Description", content: description },
    { key: "shipping", label: "Shipping", content: shipping },
    { key: "care", label: "Care", content: care },
  ]

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex gap-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`pb-2 font-heading text-sm ${
              active === tab.key
                ? "text-primary border-b-2 border-primary"
                : "text-neutral-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="text-neutral-700 font-body max-h-72 overflow-auto">{tabs.find((t) => t.key === active)?.content}</p>
    </div>
  )
}
    