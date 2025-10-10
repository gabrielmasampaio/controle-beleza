import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Counter } from '../counter';
import { NextUIProvider } from '@nextui-org/react';

const renderWithProvider = (component: React.ReactElement) => {
  return render(<NextUIProvider>{component}</NextUIProvider>);
};

describe('Counter', () => {
  it('renders with initial count of 0', () => {
    renderWithProvider(<Counter />);
    expect(screen.getByRole('button')).toHaveTextContent('Count is 0');
  });

  it('increments the count when clicked', () => {
    renderWithProvider(<Counter />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Count is 1');

    fireEvent.click(button);
    expect(button).toHaveTextContent('Count is 2');
  });
});