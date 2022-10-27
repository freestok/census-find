/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { FC, useEffect, useState } from 'react'
import styles from './CensusData.module.scss'
import { useSearchParams, useParams } from 'react-router-dom'
import axios from 'axios'
import CensusDataTable from '../CensusDataTable/CensusDataTable'

// interface CensusDataProps {}

interface TemplateInfo {
  survey: string
  var: string
  year: number
}
const CensusData: FC<any> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [censusData, setCensusData] = useState([])
  const params = useParams()

  useEffect(() => {
    getCensusData()
      .then(() => console.log('getCensusData complete'))
      .catch(err => console.error(err))
  }, [searchParams, params.geoid, params.type])
  useEffect(() => {
    console.log('refresh!')
  }, [censusData])

  const getCensusData = async (): Promise<void> => {
    console.log('useEffect triggered!!!')
    const templateId = searchParams.get('template') as string
    const res = await axios.get(`http://127.0.0.1:9090/templates/${templateId}`)
    const templateInfo: TemplateInfo[] = res.data

    // TODO let there be mixed years within a template
    // const yearArray = templateInfo.map(e => e.year)
    // const uniqueYears = [...new Set(yearArray)]
    // for (const year of uniqueYears) {

    // }
    const id = params.geoid as string
    const vars = templateInfo.map(e => e.var)
    const geogType = params.type as string
    const surveyType = templateInfo[0].survey
    let countyFips
    if (geogType === 'tract') {
      countyFips = id.slice(2, 5)
    }
    const payload = {
      geography: geogType,
      geoid: id,
      survey: surveyType,
      variables: vars,
      state: id.slice(0, 2),
      county: countyFips,
      year: templateInfo[0].year
    }
    console.log('surveyType', surveyType)
    if (surveyType.includes('acs')) {
      const result = await axios.post('http://127.0.0.1:9090/data/acs', payload)
      console.log('result', JSON.parse(JSON.stringify(result)))
      // const data: AcsResult[] = result.data
      // for (const row of result.data) {
      //   const perc = row.percent.toFixed(1)
      //   row.estimate = row.estimate.toLocaleString()
      //   row.percent = `${perc}%`
      //   row.moe_perc = row.moe_perc !== undefined ? `${row.moe_perc.toFixed(1)}%` : null
      //   row.moe = row.moe !== undefined ? row.moe.toLocaleString() : null
      // }
      setCensusData(result.data)
      console.log('result!', result)
    } else if (surveyType === 'sf1') {
      console.log('decennial data')
    }
    console.log('payload', payload)
  }

  console.log('searchParams', searchParams)

  return (
    <div className={styles.CensusData} data-testid="CensusData">
      <CensusDataTable
        data={censusData}
        showData={censusData.length > 0}/>
    </div>
  )
}

export default CensusData
