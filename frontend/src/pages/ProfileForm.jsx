import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RangeSlider from '../components/RangeSlider';
import StepperField from '../components/StepperField';
import NumberField from '../components/NumberField';
import ToggleField from '../components/ToggleField';
import ErrorBanner from '../components/ErrorBanner';
import { api } from '../services/api';
import { ClipboardCheck } from 'lucide-react';

const initialFormData = {
  cgpa: '7.80',
  internships: 2,
  projects: '',
  certifications: '',
  aptitude_score: '75',
  soft_skills_rating: '5.0',
  extracurricular_activities: false,
  placement_training: false,
  backlogs: 1,
};

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateField = (name, value) => {
    if ((name === 'projects' || name === 'certifications') && value === '') {
      return 'This field is required';
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, val) }));
  };

  const isFormValid = () => {
    return !validateField('projects', formData.projects) && !validateField('certifications', formData.certifications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setTouched({ projects: true, certifications: true });

    if (!isFormValid()) return;

    setIsSubmitting(true);

    // Stepper fields store "10" to represent the capped "10+" option — submit as-is.
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
      navigate('/result', { state: { result } });
    } catch (err) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Service unavailable, please try again');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 page-enter">
      <div className="surface-card p-6 md:p-9">
        <div className="flex items-center gap-3 mb-1">
          <div className="chip p-2.5"><ClipboardCheck size={20} /></div>
          <h1 className="font-display text-2xl font-semibold text-ink">Your details</h1>
        </div>
        <p className="text-sm text-muted mb-7 ml-[52px] -mt-1">Takes about two minutes.</p>

        <form onSubmit={handleSubmit}>
          <RangeSlider
            label="CGPA" tooltip="Your current cumulative grade point average"
            name="cgpa" value={formData.cgpa} onChange={handleChange} onBlur={handleBlur}
            min="0" max="10" step="0.01"
          />

          <StepperField
            label="Number of internships" tooltip="Total internships completed so far"
            name="internships" value={formData.internships} onChange={handleChange} onBlur={handleBlur}
            min={0} max={10}
          />

          <NumberField
            label="Number of projects" tooltip="Academic or personal projects you've completed"
            name="projects" value={formData.projects} onChange={handleChange} onBlur={handleBlur}
            min={0}
            error={touched.projects && errors.projects}
          />

          <NumberField
            label="Workshops / certifications" tooltip="Workshops attended or certifications earned"
            name="certifications" value={formData.certifications} onChange={handleChange} onBlur={handleBlur}
            min={0}
            error={touched.certifications && errors.certifications}
          />

          <RangeSlider
            label="Aptitude test score" tooltip="Your most recent aptitude test score"
            name="aptitude_score" value={formData.aptitude_score} onChange={handleChange} onBlur={handleBlur}
            min="1" max="100" step="1"
          />

          <RangeSlider
            label="Soft skills rating" tooltip="Institutional or self-evaluated rating"
            name="soft_skills_rating" value={formData.soft_skills_rating} onChange={handleChange} onBlur={handleBlur}
            min="1" max="10" step="0.1"
          />

          <ToggleField
            label="Extracurricular activities" tooltip="Have you taken part in any extracurricular activities?"
            name="extracurricular_activities" checked={formData.extracurricular_activities}
            onChange={handleChange} onBlur={handleBlur}
          />

          <ToggleField
            label="Completed placement training" tooltip="Have you completed the institutional placement training program?"
            name="placement_training" checked={formData.placement_training}
            onChange={handleChange} onBlur={handleBlur}
          />

          <StepperField
            label="Active backlogs" tooltip="Your current number of active backlogs"
            name="backlogs" value={formData.backlogs} onChange={handleChange} onBlur={handleBlur}
            min={0} max={10}
          />

          <div className="mt-8 pt-6 border-t border-line">
            <ErrorBanner message={submitError} />
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full py-4 px-4 font-display font-semibold text-lg transition-all ${
                !isFormValid() || isSubmitting
                  ? 'bg-panel text-muted cursor-not-allowed rounded-pill border-2 border-line'
                  : 'btn-primary'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Predicting...
                </span>
              ) : (
                'Predict my outcome'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
