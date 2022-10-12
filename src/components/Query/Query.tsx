import React, { FC } from 'react'
import styles from './Query.module.scss'

// interface QueryProps {}

const Query: FC<any> = () => (
  <div className={styles.Query} data-testid="Query">
    Query Component
  </div>
)

export default Query
