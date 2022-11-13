/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styles from './ExploreMap.module.scss'
// import { GeoJson, Map, Marker } from 'pigeon-maps'
import Map, { Marker, Source, Layer, FillLayer, MapRef } from 'react-map-gl'
import axios from 'axios'
import bbox from '@turf/bbox'
import maplibregl from 'maplibre-gl'
import { Text, Center, Box, useColorModeValue, Stack } from '@chakra-ui/react'
import 'maplibre-gl/dist/maplibre-gl.css'

type GeomTypes = 'state' | 'county' | 'place' | 'tract'
interface ExploreMapProps {
  activeGeom: GeomTypes
  activeState: string
  template: number
}

const geomMapper = {
  state: 'states',
  county: 'counties',
  tract: 'tracts',
  place: 'places'
}
const ExploreMap: FC<ExploreMapProps> = ({ activeGeom, activeState, template }) => {
  // basemaps
  // https://deck.gl/docs/api-reference/carto/basemap#supported-basemaps
  const mapRef = useRef<any>()

  const [lat] = useState(39.18)
  const [lon] = useState(-99.21)
  const [geojson, setGeojson] = useState<any>()
  const [hoverInfo, setHoverInfo] = useState<any>(false)
  const [cursor, setCursor] = useState('auto')
  const layerStyle: FillLayer = {
    id: 'data',
    type: 'fill',
    paint: {
      'fill-color': useColorModeValue('#2DA8B7', '#08ffff'),
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
    setGeojson(polygons)

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

  const onHover = useCallback((event: any) => {
    const {
      features,
      point: { x, y }
    } = event
    if (features.length > 0) {
      setCursor('pointer')
      setHoverInfo({ feature: features[0], x, y })
    } else {
      setHoverInfo(false)
      setCursor('auto')
    }
  }, [])

  const goToDataPage = (): void => {
    window.location.href = `/data/${activeGeom}/${hoverInfo.feature.properties.geoid}?template=${template}`
  }

  useEffect(() => {
    getGeojson()
      .then(() => console.log('getGeojson done'))
      .catch((err) => console.error(err))
  }, [activeGeom, activeState])

  return (
    <div className={styles.ExploreMap} data-testid="ExploreMap">
      <Map
        ref={mapRef}
        onMouseMove={onHover}
        onClick={goToDataPage}
        cursor={cursor}
        interactiveLayerIds={['data']}
        initialViewState={{
          longitude: lon,
          latitude: lat,
          zoom: 4
        }}
        mapLib={maplibregl}
        mapStyle={
          useColorModeValue(
            'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
            'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
          )
        }
      >
        {geojson !== undefined &&
          <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
        }
        {hoverInfo !== false && (
          <div style={{
            left: hoverInfo.x,
            top: hoverInfo.y,
            position: 'absolute',
            margin: '8px',
            padding: '4px',
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            maxWidth: '300px',
            fontSize: '10px',
            zIndex: 999,
            pointerEvents: 'none'
          }}>
            <div>{hoverInfo.feature.properties.name}</div>
          </div>
        )}
      </Map>
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        width={'25vw'}
        boxShadow={'xl'}
        style={{
          margin: '24px',
          padding: '12px 24px',
          position: 'absolute',
          top: '60px',
          right: '0',
          outline: 'none',
          cursor: 'auto'
        }}>
          <Stack>
            <Text>Click on a {activeGeom} to see its census data.</Text>
            { hoverInfo !== false &&
              <Text fontSize='small' fontStyle='italic'>
                {window.location.protocol}{window.location.hostname}/data/{activeGeom}/{hoverInfo.feature.properties.geoid}?template={template}
              </Text>
            }
          </Stack>
      </Box>
    </div>
  )
}

export default ExploreMap
