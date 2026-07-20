import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RangeSlider from '../components/RangeSlider';

describe('RangeSlider', () => {
  it('renders correctly with given props', () => {
    render(
      <RangeSlider
        label="Test Slider"
        name="test_slider"
        value={5}
        min="0"
        max="10"
        step="1"
        typicalMin="2"
        typicalMax="8"
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText('Test Slider')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '10');
  });

  it('calls onChange when interacted with', () => {
    const handleChange = vi.fn();
    render(
      <RangeSlider
        label="Test Slider"
        name="test_slider"
        value={5}
        min="0"
        max="10"
        step="1"
        typicalMin="2"
        typicalMax="8"
        onChange={handleChange}
      />
    );
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '7' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders shaded band with correct inline styles', () => {
    const { container } = render(
      <RangeSlider
        label="Test Slider"
        name="test_slider"
        value={5}
        min="0"
        max="10"
        step="1"
        typicalMin="2" // left = (2-0)/(10-0)*100 = 20%
        typicalMax="8" // width = (8-2)/(10-0)*100 = 60%
        onChange={() => {}}
      />
    );
    
    // Select the div with bg-sage/40 class
    const shadedBand = container.querySelector('.bg-sage\\/40');
    expect(shadedBand).not.toBeNull();
    expect(shadedBand.style.left).toBe('20%');
    expect(shadedBand.style.width).toBe('60%');
  });
});
