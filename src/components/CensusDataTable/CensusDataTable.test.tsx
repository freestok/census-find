import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CensusDataTable from './CensusDataTable'

describe('<CensusDataTable />', () => {
  test('it should mount', () => {
    render(<CensusDataTable columns={['a', 'b', 'c']}
    data={[]} showData={true} columnHeaders={['a', 'b', 'c']} spinnerForNoData={false}/>)

    const censusDataTable = screen.getByTestId('CensusDataTable')

    expect(censusDataTable).toBeInTheDocument()
  })
})
