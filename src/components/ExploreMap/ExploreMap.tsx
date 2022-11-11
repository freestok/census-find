/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC, useEffect, useState } from 'react'
import styles from './ExploreMap.module.scss'
import { GeoJson, Map, Marker } from 'pigeon-maps'
import axios from 'axios'

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
  // TODO zoom to geometry data that comes in
  // https://github.com/mariusandra/pigeon-maps/issues/23
  // https://github.com/mariusandra/pigeon-maps/issues/62
  const [geojson, setGeojson] = useState('')
  const [center, setCenter] = useState<any>([39.18, -99.21])
  const [zoom, setZoom] = useState(4)

  const getGeojson = async (): Promise<void> => {
    const queryParams = {
      type: geomMapper[activeGeom],
      state: activeState
    }
    const res = await axios.get('/api/geom', { params: queryParams })
    setGeojson(JSON.parse(res.data[0]))
    console.log('geojson', geojson)
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
      <Map defaultCenter={center} defaultZoom={4}
              onBoundsChanged={({ center, zoom }) => {
                console.log('bounds changed!')
                setCenter(center)
                setZoom(zoom)
              }} >
        { geojson !== '' &&
          <GeoJson
            data={geojson}
            styleCallback={(feature: any, hover: any) => {
              if (feature.geometry.type === 'LineString') {
                return { strokeWidth: '1', stroke: 'black' }
              }
              return {
                fill: '#d4e6ec99',
                strokeWidth: '1',
                stroke: 'black',
                r: '20'
              }
            }}
          />
        }
      </Map>
    </div>
  )
}

export default ExploreMap
