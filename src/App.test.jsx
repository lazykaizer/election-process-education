import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const headingElements = screen.getAllByText(/Naagrik AI/i);
  expect(headingElements.length).toBeGreaterThan(0);
});

test('navigates to dashboard on button click', async () => {
  render(<App />);
  // Wait for lazy-loaded Landing to appear
  const launchButton = await screen.findByRole('button', { name: /Start Learning/i });
  fireEvent.click(launchButton);
  
  await waitFor(() => {
    expect(screen.getByText(/Election Resource Library/i)).toBeInTheDocument();
  });
});

test('filters resource cards in dashboard', async () => {
  render(<App />);
  const launchButton = await screen.findByRole('button', { name: /Start Learning/i });
  fireEvent.click(launchButton);

  // Wait for transition to Dashboard
  const searchInput = await screen.findByPlaceholderText(/Search guides/i, {}, { timeout: 4000 });
  fireEvent.change(searchInput, { target: { value: 'NOTA' } });
  
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /What is NOTA\?/i })).toBeInTheDocument();
    expect(screen.queryByText(/NRI Voter Registration/i)).not.toBeInTheDocument();
  }, { timeout: 3000 });
});

test('chatbot opens and handles suggestions', async () => {
  render(<App />);
  const launchButton = await screen.findByRole('button', { name: /Start Learning/i });
  fireEvent.click(launchButton);

  await waitFor(() => {
    expect(screen.getByLabelText(/Open AI chat/i)).toBeInTheDocument();
  });
  
  const chatButton = screen.getByLabelText(/Open AI chat/i);
  fireEvent.click(chatButton);
  
  expect(screen.getByText(/What would you like to know\?/i)).toBeInTheDocument();
  
  const suggestion = screen.getByRole('button', { name: /What is NOTA\?/i });
  fireEvent.click(suggestion);
  
  // Check if AI responds
  await waitFor(() => {
    expect(screen.getByText(/NOTA = None of the Above/i)).toBeInTheDocument();
  }, { timeout: 5000 });
});
