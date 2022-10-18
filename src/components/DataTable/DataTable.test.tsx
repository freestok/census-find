import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import DataTable from './DataTable'

describe('<DataTable />', () => {
  test('it should mount', () => {
    render(<DataTable columns={['a', 'b', 'c']}
      data={[]} showData={true} columnHeaders={['a', 'b', 'c']}/>)

    const dataTable = screen.getByTestId('DataTable')

    expect(dataTable).toBeInTheDocument()
  })
})
