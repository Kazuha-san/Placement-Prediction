import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import RangeSlider from '../components/RangeSlider';
import { api } from '../services/api';
import ErrorBanner from '../components/ErrorBanner';

const initialFormData = {
  cgpa: '7.8',
  internships: '',
  projects: '',
  certifications: '',
  aptitude_score: '75',
  soft_skills_rating: '3.9',
  extracurricular_activities: false,
  placement_training: false,
  backlogs: ''
};

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateField = (name, value) => {
    let error = null;
    if (value === '' && typeof value !== 'boolean') {
      return 'This field is required';
    }

    const numValue = Number(value);

    switch (name) {
      case 'internships':
        if (numValue < 0 || !Number.isInteger(numValue)) error = 'Must be a valid number >= 0';
        break;
      case 'projects':
        if (numValue < 0 || !Number.isInteger(numValue)) error = 'Must be a valid number >= 0';
        break;
      case 'certifications':
        if (numValue < 0 || !Number.isInteger(numValue)) error = 'Must be a valid number >= 0';
        break;
      case 'backlogs':
        if (numValue < 0 || !Number.isInteger(numValue)) error = 'Must be a valid number >= 0';
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    if (touched[name]) {
      const error = validateField(name, val);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, val);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const newErrors = {};
    let valid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    });
    
    return valid && Object.values(errors).every(e => e === null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Set touched for all to show validation immediately if not valid
    const allTouched = Object.keys(formData).reduce((acc, key) => ({...acc, [key]: true}), {});
    setTouched(allTouched);

    if (!isFormValid()) {
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      cgpa: Number(formData.cgpa),
      internships: Number(formData.internships),
      projects: Number(formData.projects),
      certifications: Number(formData.certifications),
      aptitude_score: Number(formData.aptitude_score),
      soft_skills_rating: Number(formData.soft_skills_rating),
      extracurricular_activities: Boolean(formData.extracurricular_activities),
      placement_training: Boolean(formData.placement_training),
      backlogs: Number(formData.backlogs),
    };

    try {
      const result = await api.predict(payload);
      setIsSubmitting(false);
      // Pass the result via state to the result page
      navigate('/result', { state: { result } });
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'service unavailable, please try again');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="glass-panel p-8">
        <h2 className="font-display text-2xl font-semibold mb-6">Profile entry</h2>
        
        <ErrorBanner message={submitError} />

        <form onSubmit={handleSubmit}>
          <RangeSlider
            label="CGPA"
            tooltip="Your Cumulative Grade Point Average"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            max="10"
            step="0.01"
            typicalMin="6.5"
            typicalMax="9.1"
          />
          <FormField
            label="Number of Internships"
            tooltip="Total completed internships"
            type="number"
            name="internships"
            value={formData.internships}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.internships && errors.internships}
            min="0"
            step="1"
          />
          <FormField
            label="Number of Projects"
            tooltip="Total completed academic or personal projects"
            type="number"
            name="projects"
            value={formData.projects}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.projects && errors.projects}
            min="0"
            step="1"
          />
          <FormField
            label="Number of Workshops/Certifications"
            tooltip="Total attended workshops or earned certifications"
            type="number"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.certifications && errors.certifications}
            min="0"
            step="1"
          />
          <RangeSlider
            label="Aptitude Test Score"
            tooltip="Score from your recent aptitude test"
            name="aptitude_score"
            value={formData.aptitude_score}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            max="100"
            step="0.1"
            typicalMin="60"
            typicalMax="90"
          />
          <RangeSlider
            label="Soft Skills Rating"
            tooltip="Institutional or self-evaluated rating"
            name="soft_skills_rating"
            value={formData.soft_skills_rating}
            onChange={handleChange}
            onBlur={handleBlur}
            min="0"
            max="10"
            step="0.1"
            typicalMin="3.0"
            typicalMax="4.8"
          />
          <FormField
            label="Extracurricular Activities"
            tooltip="Have you participated in any extracurricular activities?"
            type="checkbox"
            name="extracurricular_activities"
            value={formData.extracurricular_activities}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormField
            label="Placement Training"
            tooltip="Have you completed the institutional placement training program?"
            type="checkbox"
            name="placement_training"
            value={formData.placement_training}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <FormField
            label="Active Backlogs"
            tooltip="Current number of active backlogs (must be >= 0)"
            type="number"
            name="backlogs"
            value={formData.backlogs}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.backlogs && errors.backlogs}
            min="0"
            step="1"
          />

          <div className="mt-8 pt-6 border-t border-line">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-3.5 px-4 font-display font-semibold rounded-2xl transition-colors ${
                !isFormValid() || isSubmitting
                  ? 'bg-panel text-muted cursor-not-allowed border-2 border-line'
                  : 'bg-blue text-blue-ink hover:bg-blue-hover'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-ink/30 border-t-blue-ink rounded-full animate-spin"></div>
                  Predicting...
                </div>
              ) : (
                'Predict'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
