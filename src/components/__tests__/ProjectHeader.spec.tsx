
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectHeader from '../ProjectHeader';

// Mock der Komponenten-Props
const mockProps = {
  project: {
    id: '1',
    title: 'Test Project',
    type: 'movie',
    logline: 'Test logline',
    user_id: 'user123',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    genres: [],
    scenes: [],
    characters: [],
    episodes: []
  },
  onNewScene: jest.fn(),
  onEditProject: jest.fn(),
  onNewCharacter: jest.fn(),
  onDeleteProject: jest.fn(),
  onNewEpisode: jest.fn(),
};

describe('ProjectHeader Component', () => {
  it('renders the project title', () => {
    render(<ProjectHeader {...mockProps} />);
    const titleElement = screen.getByText('Test Project');
    expect(titleElement).toBeInTheDocument();
  });

  it('displays the correct project type', () => {
    render(<ProjectHeader {...mockProps} />);
    const typeElement = screen.getByText(/movie/i);
    expect(typeElement).toBeInTheDocument();
  });
});
