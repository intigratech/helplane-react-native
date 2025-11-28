import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type {
  HelpLaneConfig,
  HelpLaneContextValue,
  HelpLaneProviderProps,
  HelpLaneUser,
} from './types';
import { HelpLaneChat } from './HelpLaneChat';

const HelpLaneContext = createContext<HelpLaneContextValue | null>(null);

/**
 * Hook to access HelpLane context
 * Must be used within a HelpLaneProvider
 */
export function useHelpLane(): HelpLaneContextValue {
  const context = useContext(HelpLaneContext);
  if (!context) {
    throw new Error('useHelpLane must be used within a HelpLaneProvider');
  }
  return context;
}

/**
 * Provider component for HelpLane SDK
 * Wrap your app with this provider to use HelpLane
 */
export function HelpLaneProvider({
  config,
  user: initialUser,
  children,
}: HelpLaneProviderProps) {
  const [user, setUser] = useState<HelpLaneUser | null>(initialUser || null);
  const [isVisible, setIsVisible] = useState(false);

  const identify = useCallback((newUser: HelpLaneUser) => {
    setUser(newUser);
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const value = useMemo<HelpLaneContextValue>(
    () => ({
      config,
      user,
      identify,
      clearUser,
      show,
      hide,
      isVisible,
    }),
    [config, user, identify, clearUser, show, hide, isVisible]
  );

  return (
    <HelpLaneContext.Provider value={value}>
      {children}
      <HelpLaneChat visible={isVisible} onClose={hide} />
    </HelpLaneContext.Provider>
  );
}

/**
 * Standalone HelpLane instance for use without Provider
 * Useful for simpler integrations or when you don't need context
 */
export class HelpLane {
  private static config: HelpLaneConfig | null = null;
  private static user: HelpLaneUser | null = null;

  /**
   * Configure the SDK with your brand token
   */
  static configure(config: HelpLaneConfig): void {
    HelpLane.config = config;
  }

  /**
   * Identify the current user
   */
  static identify(user: HelpLaneUser): void {
    HelpLane.user = user;
  }

  /**
   * Clear the current user (for logout)
   */
  static clearUser(): void {
    HelpLane.user = null;
  }

  /**
   * Get current configuration
   */
  static getConfig(): HelpLaneConfig | null {
    return HelpLane.config;
  }

  /**
   * Get current user
   */
  static getUser(): HelpLaneUser | null {
    return HelpLane.user;
  }
}
