/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { useColorModeValue, Stack, Box, Text, Heading, Center } from '@chakra-ui/react'
import Map, { Marker, Source, Layer, FillLayer, MapRef } from 'react-map-gl'
import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styles from './QueryMap.module.scss'
import maplibregl from 'maplibre-gl'
import bbox from '@turf/bbox'

interface QueryMapProps {
  geojson: any
}

interface PopupInterface {
  feature: any
}

const PopupInfo: FC<PopupInterface> = ({ feature }) => (
  <>
    {Object.keys(feature).map((group: any) => (
      <>
        <Center key={group}>
          <Heading size='md'>
            {group}
          </Heading>
        </Center>
        <Stack>
          {feature[group].map((e: any) => (
            <Text key={`${e.variable}-${e.value}`}>
              {e.variable}: {e.value.toLocaleString()}
            </Text>
          ))}
          {/* {JSON.stringify(feature[group])} */}
          {/* {feature[group][0]}: {feature[group][1]} {feature[group][2]} */}
        </Stack>
      </>
    ))}
  </>
)

const QueryMap: FC<QueryMapProps> = ({ geojson }) => {
  const mapRef = useRef<any>()
  const [lat] = useState(39.18)
  const [lon] = useState(-99.21)
  // const [geojson, setGeojson] = useState<any>()
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

  const onHover = useCallback((event: any) => {
    const {
      features,
      point: { x, y }
    } = event

    let concept: any
    let previousKey = ''
    if (features.length > 0) {
      const feature = features[0]
      // console.log('feature', feature)
      const info: any = {}
      for (const key of Object.keys(feature.properties)) {
        if (key === 'name') continue
        let [newConcept, variable] = key.split(' - ')
        variable = variable.replace(' (label)', '')
        if (concept === undefined || newConcept !== concept) {
          info[newConcept] = []
        }
        const value = feature.properties[key]
        let [estimate, percent, moe] = value.split(';')
        estimate = Number(estimate).toLocaleString()
        moe = Number(moe).toLocaleString()

        moe === 'NaN'
          ? info[newConcept].push({ variable, value: `${estimate} (${percent}%)` })
          : info[newConcept].push({ variable, value: `${estimate} (${percent}%) ±${moe}` })

        concept = newConcept
        previousKey = key
      }
      setCursor('pointer')
      setHoverInfo({ feature, x, y, info })
      console.log('hoverInfo', info)
    } else {
      setHoverInfo(false)
      setCursor('auto')
    }
  }, [])

  const onMapLoad = (event: any): void => {
    // let minLng, minLat, maxLng, maxLat
    const [minLng, minLat, maxLng, maxLat] = bbox(geojson)

    console.log('mapRef.current', mapRef.current)
    mapRef.current?.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      { padding: 40, duration: 1000 }
    )
  }

  return (
    <div className={styles.QueryMap} data-testid="QueryMap">
        <Map
          ref={mapRef}
          onMouseMove={onHover}
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
          onLoad={onMapLoad}
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
              maxWidth: '25vw',
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
              { hoverInfo === false
                ? <Text>Hover over a result to see more info</Text>
                : <PopupInfo feature={hoverInfo.info} />
              }
            </Stack>
        </Box>
          </div>
  )
}

export default QueryMap
