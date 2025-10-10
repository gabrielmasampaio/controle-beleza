import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginCard from '../loginCard';
import * as api from '@/app/lib/api/auth';
import * as storage from '@/app/lib/localStorage/auth';
import { NextUIProvider } from '@nextui-org/react';

// Mock the API and storage functions
jest.mock('@/app/lib/api/auth', () => ({
  login: jest.fn(),
}));
jest.mock('@/app/lib/localStorage/auth', () => ({
  saveToken: jest.fn(),
}));

const mockedApi = api as jest.Mocked<typeof api>;
const mockedStorage = storage as jest.Mocked<typeof storage>;

const renderWithProvider = (component: React.ReactElement) => {
  return render(<NextUIProvider>{component}</NextUIProvider>);
};

describe('LoginCard', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    renderWithProvider(<LoginCard />);
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Faça login para continuar')).toBeInTheDocument();
    expect(screen.getByLabelText('Nome de usuário')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
  });

  it('allows typing in username and password fields', () => {
    renderWithProvider(<LoginCard />);
    const usernameInput = screen.getByLabelText('Nome de usuário') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows an error message on failed login', async () => {
    mockedApi.login.mockRejectedValue(new Error('Invalid credentials'));

    renderWithProvider(<LoginCard />);

    const usernameInput = screen.getByLabelText('Nome de usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('*Credenciais inválidas')).toBeVisible();
    });

    expect(mockedStorage.saveToken).not.toHaveBeenCalled();
  });

  it('calls onLoginSuccess and saves token on successful login', async () => {
    const onLoginSuccess = jest.fn();
    const token = 'fake-token';
    mockedApi.login.mockResolvedValue({ token });

    renderWithProvider(<LoginCard onLoginSuccess={onLoginSuccess} />);

    const usernameInput = screen.getByLabelText('Nome de usuário');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedApi.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password',
      });
    });

    expect(mockedStorage.saveToken).toHaveBeenCalledWith(token);
    expect(onLoginSuccess).toHaveBeenCalled();
    expect(screen.queryByText('*Credenciais inválidas')).not.toBeInTheDocument();
  });
});