'use client'

import { Viewer } from 'cesium'
import { useEffect } from 'react'

export default function MapStatic() {
  useEffect(() => {
    const viewer = new Viewer('cesiumContainer', {
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      infoBox: false,
      // terrainProvider: await createWorldTerrainAsync(),
    })
    return () => {
      viewer.destroy()
    }
  }, [])
  return <div id="cesiumContainer" style={{ height: '80vh', width: '80vh' }} />
}