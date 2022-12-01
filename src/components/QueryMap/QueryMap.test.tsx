import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import QueryMap from './QueryMap'

describe('<QueryMap />', () => {
  test('it should mount', () => {
    render(<QueryMap geojson={1}/>)

    const queryMap = screen.getByTestId('QueryMap')

    expect(queryMap).toBeInTheDocument()
  })
})
