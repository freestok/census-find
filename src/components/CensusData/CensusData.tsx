/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

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
type SurveyType = 'acs5' | 'sf1'

const CensusData: FC<any> = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [censusData, setCensusData] = useState([])
  const [survey, setSurvey] = useState<SurveyType>()
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
    const res = await axios.get(`${process.env.REACT_APP_API}/templates/${templateId}`)
    const templateInfo: TemplateInfo[] = res.data

    // TODO let there be mixed years within a template
    // const yearArray = templateInfo.map(e => e.year)
    // const uniqueYears = [...new Set(yearArray)]
    // for (const year of uniqueYears) {

    // }
    const id = params.geoid as string
    const vars = templateInfo.map(e => e.var)
    const geogType = params.type as string
    const surveyType = templateInfo[0].survey as SurveyType
    setSurvey(surveyType)
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
      const result = await axios.post(`${process.env.REACT_APP_API}/data/acs`, payload)
      console.log('result', JSON.parse(JSON.stringify(result)))
      setCensusData(result.data)
      console.log('result!', result)
    } else if (surveyType === 'sf1') {
      // TODO implement decennial logic
      console.log('decennial data')
      const result = await axios.post(`${process.env.REACT_APP_API}/data/dec`, payload)
      const data = result.data.filter((e: any) => e.label !== 'Not defined for this file')
      setCensusData(data)
      console.log('result!', result)
    }
    console.log('payload', payload)
  }

  console.log('searchParams', searchParams)

  return (
    <div className={styles.CensusData} data-testid="CensusData">
      { survey !== undefined &&
        <CensusDataTable
          data={censusData}
          type={survey}
          showData={censusData.length > 0}/>
      }
    </div>
  )
}

export default CensusData
