'use client'

import { Viewer, GeoJsonDataSource, ImageryLayer, TileMapServiceImageryProvider, buildModuleUrl } from 'cesium'
import { useEffect } from 'react'

interface MapStaticProps {
  geojson?: any;
  /*
  // If false, it will not zoom to anything.
  // The default is to zoomTo of the geojson.
  // If you want to zoom to a different object, pass that object
  */
  zoomTo?: false | any;
}

export default function MapStatic({ geojson, zoomTo }: MapStaticProps) {
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
      baseLayer: ImageryLayer.fromProviderAsync(
        TileMapServiceImageryProvider.fromUrl(
          buildModuleUrl("Assets/Textures/NaturalEarthII"),
        ),
      ),
    })

    var dataSource = null;
    if (geojson !== undefined) {
      dataSource = GeoJsonDataSource.load(geojson, {
        clampToGround: true,
        credit: "",
      });
      viewer.dataSources.add(dataSource)
    }

    if (zoomTo === undefined && dataSource !== null) {
      zoomTo = dataSource
    }
    if (zoomTo !== false) {
      viewer.zoomTo(zoomTo)
    }

    return () => {
      viewer.destroy()
    }
  }, [])
  return <div id="cesiumContainer" style={{ height: '80vh', width: '80vh' }} />
}