import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Templates from './Templates'

describe('<Templates />', () => {
  test('it should mount', () => {
    render(<Templates />)

    const templates = screen.getByTestId('Templates')

    expect(templates).toBeInTheDocument()
  })
})
