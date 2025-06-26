
import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export type UserProfile = 'university' | 'school';

export function useUserProfile() {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('user-profile', null);
  const [showProfileSelector, setShowProfileSelector] = useState(false);

  useEffect(() => {
    if (userProfile === null) {
      setShowProfileSelector(true);
    } else {
      setShowProfileSelector(false);
    }
  }, [userProfile]);

  const selectProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowProfileSelector(false);
  };

  const resetProfile = () => {
    setUserProfile(null);
    setShowProfileSelector(true);
  };

  return {
    userProfile,
    showProfileSelector,
    selectProfile,
    resetProfile,
    isUniversity: userProfile === 'university',
    isSchool: userProfile === 'school'
  };
}
