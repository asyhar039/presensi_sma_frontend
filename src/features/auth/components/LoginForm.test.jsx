import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';

describe('LoginForm Component', () => {
  it('berhasil dirender dengan elemen utama', () => {
    render(<LoginForm />);
    expect(screen.getByText('Welcome!')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('dapat mengisi input username dan password', () => {
    render(<LoginForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.change(usernameInput, { target: { value: 'isestar@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('isestar@gmail.com');
    expect(passwordInput.value).toBe('password123');
  });

  it('dapat toggle visibility password', () => {
    render(<LoginForm />);
    const passwordInput = screen.getByTestId('password-input');
    const toggleButton = screen.getByRole('button', { name: /tampilkan password/i });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
  });

  it('menampilkan validation error jika form kosong saat disubmit', async () => {
    render(<LoginForm />);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.click(submitButton);

    expect(await screen.findByText('Username wajib diisi')).toBeInTheDocument();
    expect(await screen.findByText('Password wajib diisi')).toBeInTheDocument();
  });

  it('menampilkan validation error jika password terlalu pendek', async () => {
    render(<LoginForm />);
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'test@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Password minimal 6 karakter')).toBeInTheDocument();
  });

  it('memanggil onSubmit ketika form valid disubmit', async () => {
    const handleSubmit = vi.fn();
    render(<LoginForm onSubmit={handleSubmit} />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByTestId('password-input');
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(usernameInput, { target: { value: 'isestar@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        username: 'isestar@gmail.com',
        password: 'password123',
      });
    });
  });

  it('menampilkan loading state pada button ketika loading prop true', () => {
    render(<LoginForm loading={true} />);
    const submitButton = screen.getByRole('button', { name: /memproses.../i });
    expect(submitButton).toBeDisabled();
  });

  it('menampilkan error message dari server jika errorMessage prop disediakan', () => {
    render(<LoginForm errorMessage="Username atau password salah" />);
    expect(screen.getByText('Username atau password salah')).toBeInTheDocument();
  });
});
