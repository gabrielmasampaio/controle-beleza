import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeSwitch } from '../theme-switch';
import { NextUIProvider } from '@nextui-org/react';
import { useTheme } from 'next-themes';

// Mock the useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

const mockedUseTheme = useTheme as jest.Mock;

const renderWithProvider = (component: React.ReactElement) => {
  return render(<NextUIProvider>{component}</NextUIProvider>);
};

describe('ThemeSwitch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders with the correct label for the light theme', () => {
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme: jest.fn() });
    renderWithProvider(<ThemeSwitch />);
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('renders with the correct label for the dark theme', () => {
    mockedUseTheme.mockReturnValue({ theme: 'dark', setTheme: jest.fn() });
    renderWithProvider(<ThemeSwitch />);
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
  });

  it('calls setTheme to switch to dark mode when clicked', () => {
    const setTheme = jest.fn();
    mockedUseTheme.mockReturnValue({ theme: 'light', setTheme });
    renderWithProvider(<ThemeSwitch />);

    const switchButton = screen.getByRole('switch');
    fireEvent.click(switchButton);

    expect(setTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme to switch to light mode when clicked', () => {
    const setTheme = jest.fn();
    mockedUseTheme.mockReturnValue({ theme: 'dark', setTheme });
    renderWithProvider(<ThemeSwitch />);

    const switchButton = screen.getByRole('switch');
    fireEvent.click(switchButton);

    expect(setTheme).toHaveBeenCalledWith('light');
  });
});