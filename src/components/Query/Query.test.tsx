import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Query from './Query'

describe('<Query />', () => {
  test('it should mount', () => {
    render(<Query />)

    const query = screen.getByTestId('Query')

    expect(query).toBeInTheDocument()
  })
})
