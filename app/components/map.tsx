'use client'

import { Viewer } from 'cesium'
import { useEffect } from 'react'

export default function MapStatic() {
  useEffect(() => {
    const viewer = new Viewer('cesiumContainer', {
      // terrainProvider: await createWorldTerrainAsync(),
    })
    return () => {
      viewer.destroy()
    }
  }, [])
  return <div id="cesiumContainer" style={{height: '100vh', width: '100vw'}} />
}