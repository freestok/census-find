/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC } from 'react'
import styles from './ExploreMap.module.scss'
import { Map, Marker } from 'pigeon-maps'// interface ExploreMapProps {}

const ExploreMap: FC<any> = () => (
  <div className={styles.ExploreMap} data-testid="ExploreMap">
    <Map defaultCenter={[39.18, -99.21]} defaultZoom={4}>
      <Marker width={50} anchor={[50.879, 4.6997]} />
    </Map>
  </div>
)

export default ExploreMap
