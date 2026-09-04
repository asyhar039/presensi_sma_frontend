import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthLayout from './AuthLayout';

describe('AuthLayout Component Responsive Structure', () => {
  it('renders children with responsive container structure', () => {
    const { container } = render(
      <AuthLayout>
        <div data-testid="test-child">Child Form</div>
      </AuthLayout>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();

    const outerWrapper = container.firstChild;
    expect(outerWrapper).toHaveClass('min-h-dvh', 'w-full', 'overflow-y-auto');

    const card = container.querySelector('.max-w-\\[420px\\]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('w-full', 'overflow-hidden');
  });
});
