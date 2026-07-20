import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProfileForm from '../pages/ProfileForm';

// Mock the API so tests don't try to actually fetch
vi.mock('../services/api', () => ({
  api: {
    predict: vi.fn().mockResolvedValue({ confidence: 0.85, outcome: true }),
  },
}));

describe('ProfileForm with RangeSliders', () => {
  it('renders RangeSliders for cgpa, aptitude_score, and soft_skills_rating and standard input for internships', () => {
    render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );

    const cgpaSlider = screen.getByLabelText(/CGPA/i);
    expect(cgpaSlider).toHaveAttribute('type', 'range');
    expect(cgpaSlider.value).toBe('7.8');

    const aptitudeSlider = screen.getByLabelText(/Aptitude Test Score/i);
    expect(aptitudeSlider).toHaveAttribute('type', 'range');
    expect(aptitudeSlider.value).toBe('75');

    const softSkillsSlider = screen.getByLabelText(/Soft Skills Rating/i);
    expect(softSkillsSlider).toHaveAttribute('type', 'range');
    expect(softSkillsSlider.value).toBe('3.9');

    const internshipsInput = screen.getByLabelText(/Number of Internships/i);
    expect(internshipsInput).toHaveAttribute('type', 'number');
  });

  it('updates cgpa value on slider interaction', () => {
    render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );
    
    const cgpaSlider = screen.getByLabelText(/CGPA/i);
    fireEvent.change(cgpaSlider, { target: { value: '8.5' } });
    expect(cgpaSlider.value).toBe('8.5');
  });

  it('can submit the form if required fields are filled', async () => {
    render(
      <MemoryRouter>
        <ProfileForm />
      </MemoryRouter>
    );

    const cgpaSlider = screen.getByLabelText(/CGPA/i);
    fireEvent.change(cgpaSlider, { target: { value: '8.5' } });
    
    const internshipsInput = screen.getByLabelText(/Number of Internships/i);
    fireEvent.change(internshipsInput, { target: { value: '2' } });

    const projectsInput = screen.getByLabelText(/Number of Projects/i);
    fireEvent.change(projectsInput, { target: { value: '2' } });

    const certsInput = screen.getByLabelText(/Number of Workshops\/Certifications/i);
    fireEvent.change(certsInput, { target: { value: '2' } });

    const backlogsInput = screen.getByLabelText(/Active Backlogs/i);
    fireEvent.change(backlogsInput, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /predict/i });
    expect(submitButton).not.toBeDisabled();
  });
});
