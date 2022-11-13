import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import VariableList from './VariableList'

describe('<VariableList />', () => {
  test('it should mount', () => {
    render(<VariableList shallow={true} resultNumber={100} resultStyle='top'
              setActiveDataset={null as any}
              setActiveYear={null as any}
              setHighLevelList={null as any}
              setFilteredData={null as any}
              filteredData={1}/>)

    const variableList = screen.getByTestId('VariableList')

    expect(variableList).toBeInTheDocument()
  })
})
