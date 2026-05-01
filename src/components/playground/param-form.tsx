"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { ToolInputSchema, ToolProperty } from "@/lib/playground/types"

// ─── Single field ─────────────────────────────────────────────────────────────

interface FieldProps {
  name: string
  schema: ToolProperty
  required: boolean
  value: string
  onChange: (v: string) => void
}

function Field({ name, schema, required, value, onChange }: FieldProps) {
  const label = (
    <label className="flex items-center gap-1.5 text-[11px] font-medium text-white/55 mb-1.5">
      <span className="font-mono text-white/75">{name}</span>
      {required && <span className="text-red-400/70 text-[10px]">required</span>}
      {schema.type && (
        <span className="text-white/28 text-[10px] font-normal">{schema.type}</span>
      )}
    </label>
  )

  const hint = schema.description && (
    <p className="mt-1 text-[10px] text-white/30 leading-relaxed">{schema.description}</p>
  )

  const baseInput = cn(
    "w-full bg-[oklch(0.09_0.018_278)] border border-white/[0.08] rounded-lg px-3 py-2",
    "text-[12px] font-mono text-white/80 placeholder:text-white/22",
    "focus:outline-none focus:border-white/[0.18] transition-colors"
  )

  // Boolean → toggle
  if (schema.type === "boolean") {
    return (
      <div>
        {label}
        <div className="flex items-center gap-3">
          {["true", "false"].map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all",
                value === opt
                  ? "border-violet-500/40 bg-violet-500/15 text-violet-300"
                  : "border-white/[0.08] bg-white/[0.04] text-white/45 hover:text-white/70"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        {hint}
      </div>
    )
  }

  // Enum → select
  if (schema.enum && schema.enum.length > 0) {
    return (
      <div>
        {label}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(baseInput, "cursor-pointer")}
        >
          <option value="">— select —</option>
          {schema.enum.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {hint}
      </div>
    )
  }

  // Number
  if (schema.type === "number" || schema.type === "integer") {
    return (
      <div>
        {label}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={schema.default !== undefined ? String(schema.default) : "0"}
          className={baseInput}
        />
        {hint}
      </div>
    )
  }

  // Long text / object / array → textarea
  if (
    schema.type === "object" ||
    schema.type === "array" ||
    (schema.description ?? "").length > 80
  ) {
    return (
      <div>
        {label}
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={schema.type === "object" || schema.type === "array" ? 4 : 2}
          spellCheck={false}
          placeholder={
            schema.type === "object"
              ? '{ "key": "value" }'
              : schema.type === "array"
              ? '["item1", "item2"]'
              : schema.description ?? ""
          }
          className={cn(baseInput, "resize-y")}
        />
        {hint}
      </div>
    )
  }

  // Default → text input
  return (
    <div>
      {label}
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={schema.description ?? name}
        className={baseInput}
      />
      {hint}
    </div>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────

interface ParamFormProps {
  schema: ToolInputSchema
  onChange: (args: Record<string, unknown>) => void
}

export function ParamForm({ schema, onChange }: ParamFormProps) {
  const properties = schema.properties ?? {}
  const required = new Set(schema.required ?? [])
  const fields = Object.entries(properties)

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const [k, prop] of fields) {
      init[k] = prop.default !== undefined ? String(prop.default) : ""
    }
    return init
  })

  // Reset when schema changes
  useEffect(() => {
    const init: Record<string, string> = {}
    for (const [k, prop] of Object.entries(schema.properties ?? {})) {
      init[k] = prop.default !== undefined ? String(prop.default) : ""
    }
    setValues(init)
  }, [schema])

  // Emit parsed args whenever values change
  useEffect(() => {
    const args: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(values)) {
      if (v === "") continue
      const prop = properties[k]
      if (!prop) continue
      if (prop.type === "boolean") {
        args[k] = v === "true"
      } else if (prop.type === "number" || prop.type === "integer") {
        const n = Number(v)
        if (!isNaN(n)) args[k] = n
      } else if (prop.type === "object" || prop.type === "array") {
        try { args[k] = JSON.parse(v) } catch { args[k] = v }
      } else {
        args[k] = v
      }
    }
    onChange(args)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const setField = (k: string, v: string) =>
    setValues(prev => ({ ...prev, [k]: v }))

  if (fields.length === 0) {
    return (
      <p className="text-[11px] text-white/35 italic py-2">
        This tool takes no parameters.
      </p>
    )
  }

  // Sort: required fields first
  const sorted = [...fields].sort(([a], [b]) => {
    const aReq = required.has(a) ? 0 : 1
    const bReq = required.has(b) ? 0 : 1
    return aReq - bReq
  })

  return (
    <div className="space-y-4">
      {sorted.map(([name, prop]) => (
        <Field
          key={name}
          name={name}
          schema={prop}
          required={required.has(name)}
          value={values[name] ?? ""}
          onChange={v => setField(name, v)}
        />
      ))}
    </div>
  )
}
