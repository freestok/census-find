import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Explore from './Explore'

describe('<Explore />', () => {
  test('it should mount', () => {
    render(<Explore />)

    const explore = screen.getByTestId('Explore')

    expect(explore).toBeInTheDocument()
  })
})
