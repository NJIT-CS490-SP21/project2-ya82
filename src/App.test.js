import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';
 
test('Board only shows after login', () => {
  const result = render(<App />);

  const inputFieldElement = screen.getByRole('textbox');
  fireEvent.change(inputFieldElement, {
    target: { value: 'Guest01' },
  });
  
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.queryAllByRole('button')).toBeNull;
  fireEvent.click(screen.getByText('Login'));

  expect(screen.queryAllByRole('button')).not.toBeNull;
});



