import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

/**
 * Most people never click a visible "Exit guest session" button - they just
 * hit the browser/phone back button, or close the tab. Closing the tab is
 * fine (the cookie-less guest state just disappears). But browser Back stays
 * inside the SPA, and without this guard, isGuest silently carries on being
 * true - so a "fresh" visit later in the same tab can look like a stale
 * leftover guest session instead of a clean start.
 *
 * This traps the back button while isGuest is true: instead of letting the
 * browser navigate away, it re-asserts the current history entry and shows
 * a confirm modal. Choosing "Exit" actually ends the session (same as the
 * TopBar's Exit button); "Cancel" just dismisses the prompt and you stay
 * exactly where you were.
 */
const GuestExitGuard = () => {
  const { isGuest, logout } = useAuth();
  const navigate = useNavigate();
  const [promptOpen, setPromptOpen] = useState(false);
  const [exiting, setExiting] = useState(false);

  // Refs so the popstate listener (registered once) always sees current
  // values instead of a stale closure from whenever it was first attached.
  const isGuestRef = useRef(isGuest);
  const trapPushedRef = useRef(false);
  useEffect(() => { isGuestRef.current = isGuest; }, [isGuest]);

  useEffect(() => {
    if (isGuest && !trapPushedRef.current) {
      // One extra history entry so the very first Back press lands on this
      // trap instead of immediately leaving the guest flow.
      window.history.pushState({ guestTrap: true }, '', window.location.href);
      trapPushedRef.current = true;
    }
    if (!isGuest) {
      trapPushedRef.current = false;
    }
  }, [isGuest]);

  useEffect(() => {
    const onPopState = () => {
      if (!isGuestRef.current) return; // not a guest anymore - let Back work normally
      // Re-push immediately so this Back press doesn't actually go anywhere;
      // the confirm modal decides what happens next instead.
      window.history.pushState({ guestTrap: true }, '', window.location.href);
      setPromptOpen(true);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleExit = async () => {
    setExiting(true);
    await logout();
    setPromptOpen(false);
    setExiting(false);
    navigate('/', { replace: true });
  };

  if (!promptOpen) return null;

  return (
    <ConfirmModal
      title="Leave your guest session?"
      message="Going back will end your guest session - anything you entered won't be saved. You can also just cancel and stay here."
      confirmLabel="Exit session"
      cancelLabel="Stay"
      danger
      loading={exiting}
      onConfirm={handleExit}
      onCancel={() => setPromptOpen(false)}
    />
  );
};

export default GuestExitGuard;
