import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CensusData from './CensusData';

describe('<CensusData />', () => {
  test('it should mount', () => {
    render(<CensusData />);
    
    const censusData = screen.getByTestId('CensusData');

    expect(censusData).toBeInTheDocument();
  });
});