/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC, useEffect, useRef, useState } from 'react'
import styles from './ExploreMap.module.scss'
// import { GeoJson, Map, Marker } from 'pigeon-maps'
import Map, { Marker, Source, Layer, FillLayer, MapRef } from 'react-map-gl'
import axios from 'axios'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

type GeomTypes = 'state' | 'county' | 'place' | 'tract'
interface ExploreMapProps {
  activeGeom: GeomTypes
  activeState: string
}

const geomMapper = {
  state: 'states',
  county: 'counties',
  tract: 'tracts',
  place: 'places'
}
const ExploreMap: FC<ExploreMapProps> = ({ activeGeom, activeState }) => {
  const mapRef = useRef<any>()

  const [lat, setLat] = useState(39.18)
  const [lon, setLon] = useState(-99.21)
  const [geojson, setGeojson] = useState<any>()
  const [center, setCenter] = useState<any>([-99.21, 39.18])
  const [zoom, setZoom] = useState(4)

  const layerStyle: FillLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-color': '#2DA8B7',
      'fill-opacity': 0.6,
      'fill-outline-color': 'black'
    }
  }
  const getGeojson = async (): Promise<void> => {
    const queryParams = {
      type: geomMapper[activeGeom],
      state: activeState
    }
    const res = await axios.get('/api/geom', { params: queryParams })
    const polygons = JSON.parse(res.data[0])
    console.log('got polygons')
    setGeojson(polygons)
    console.log('geojson', geojson)

    // set bounds
    let minLng, minLat, maxLng, maxLat
    if (activeGeom === 'state') {
      [minLng, minLat, maxLng, maxLat] = [-173.994, 5.896, -53.567, 72.693]
    } else {
      [minLng, minLat, maxLng, maxLat] = bbox(polygons)
    }

    mapRef.current.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      { padding: 40, duration: 1000 }
    )
  }

  useEffect(() => {
    console.log('activeGeom', activeGeom)
    console.log('activeState', activeState)
    getGeojson()
      .then(() => console.log('getGeojson done'))
      .catch((err) => console.error(err))
  }, [activeGeom, activeState])

  return (
    <div className={styles.ExploreMap} data-testid="ExploreMap">
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: lon,
          latitude: lat,
          zoom: 4
        }}
        mapLib={maplibregl}
        // style={{ width: 800, height: 600 }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        {geojson !== undefined &&
          <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        }
      </Map>
    </div>
  )
}

export default ExploreMap
