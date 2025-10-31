'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from './use-auth';

export function useSessionTimeout(timeoutMinutes: number = 2) {
  const { logout, isAuthenticated } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    if (!isAuthenticated) return;

    // Auto logout after timeout
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout(); // Initial timeout

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout, true);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [isAuthenticated, timeoutMinutes]);
}