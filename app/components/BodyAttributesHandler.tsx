"use client"

import { useEffect } from 'react'

export default function BodyAttributesHandler() {
  useEffect(() => {
    document.body.setAttribute('data-new-gr-c-s-check-loaded', '')
    document.body.setAttribute('data-gr-ext-installed', '')
  }, [])

  return null
}