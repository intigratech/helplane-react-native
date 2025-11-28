/**
 * User information for HelpLane chat sessions
 */
export interface HelpLaneUser {
  /** External user ID from your system */
  userId?: string;
  /** User's email address */
  email?: string;
  /** User's display name */
  name?: string;
  /** User's phone number */
  phone?: string;
  /** User tier/plan (e.g., "free", "pro", "enterprise") */
  tier?: string;
  /** Custom metadata key-value pairs */
  meta?: Record<string, unknown>;
}

/**
 * Configuration options for HelpLane SDK
 */
export interface HelpLaneConfig {
  /** Your HelpLane brand token */
  brandToken: string;
  /** Custom API base URL (defaults to https://api.helplane.io) */
  baseUrl?: string;
}

/**
 * Props for the HelpLaneChat component
 */
export interface HelpLaneChatProps {
  /** Whether the chat is visible */
  visible: boolean;
  /** Callback when user closes the chat */
  onClose?: () => void;
  /** Callback when chat finishes loading */
  onLoad?: () => void;
  /** Callback when chat fails to load */
  onError?: (error: Error) => void;
  /** Custom styles for the container */
  style?: object;
}

/**
 * Props for the HelpLaneProvider component
 */
export interface HelpLaneProviderProps {
  /** HelpLane configuration */
  config: HelpLaneConfig;
  /** Optional user to identify */
  user?: HelpLaneUser;
  /** Children components */
  children: React.ReactNode;
}

/**
 * Context value for HelpLane
 */
export interface HelpLaneContextValue {
  /** Current configuration */
  config: HelpLaneConfig;
  /** Current identified user */
  user: HelpLaneUser | null;
  /** Identify a user */
  identify: (user: HelpLaneUser) => void;
  /** Clear the current user */
  clearUser: () => void;
  /** Show the chat widget */
  show: () => void;
  /** Hide the chat widget */
  hide: () => void;
  /** Whether chat is currently visible */
  isVisible: boolean;
}
