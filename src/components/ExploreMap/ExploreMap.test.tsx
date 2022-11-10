import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import ExploreMap from './ExploreMap'

describe('<ExploreMap />', () => {
  test('it should mount', () => {
    render(<ExploreMap />)

    const exploreMap = screen.getByTestId('ExploreMap')

    expect(exploreMap).toBeInTheDocument()
  })
})
