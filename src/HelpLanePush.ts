/**
 * Push notification manager for HelpLane React Native SDK
 *
 * HelpLane uses OneSignal for push notifications. This class provides helpers
 * for integrating OneSignal with HelpLane contacts.
 *
 * ## Setup
 * 1. Add react-native-onesignal to your app
 * 2. Initialize OneSignal in your App component
 * 3. After chat session starts, call `HelpLanePush.login(contactUUID)`
 *
 * ## Example
 * ```tsx
 * import { OneSignal } from 'react-native-onesignal';
 * import { HelpLanePush } from '@helplane/react-native';
 *
 * // In App.tsx
 * OneSignal.initialize('YOUR_ONESIGNAL_APP_ID');
 *
 * // After chat session (you'll get contactUUID from the WebSocket)
 * const externalId = HelpLanePush.login('contact-uuid-from-session');
 * OneSignal.login(externalId);
 *
 * // On logout
 * HelpLanePush.logout();
 * OneSignal.logout();
 * ```
 */
export class HelpLanePush {
  private static contactUUID: string | null = null;

  /**
   * Login to OneSignal with the contact UUID
   * Call this after a chat session is established to receive push notifications
   *
   * This generates the OneSignal external_id as "contact_{uuid}" which allows
   * the HelpLane backend to send targeted notifications.
   *
   * IMPORTANT: You must call OneSignal.login() yourself with the returned external ID
   *
   * @param contactUUID The contact's UUID from HelpLane
   * @returns The external ID to use with OneSignal.login()
   */
  static login(contactUUID: string): string {
    HelpLanePush.contactUUID = contactUUID;
    const externalId = `contact_${contactUUID}`;

    console.log(`[HelpLane] Push: Login with external ID: ${externalId}`);
    console.log(`[HelpLane] Push: Call OneSignal.login("${externalId}") in your app`);

    return externalId;
  }

  /**
   * Logout from OneSignal
   * Call this when the user logs out to stop receiving push notifications
   *
   * IMPORTANT: You must call OneSignal.logout() yourself
   */
  static logout(): void {
    HelpLanePush.contactUUID = null;
    console.log('[HelpLane] Push: Logged out - call OneSignal.logout() in your app');
  }

  /**
   * Get the OneSignal external ID for the current contact
   * Use this to call OneSignal.login() in your app
   *
   * @returns The external ID string, or null if not logged in
   */
  static getExternalId(): string | null {
    if (!HelpLanePush.contactUUID) return null;
    return `contact_${HelpLanePush.contactUUID}`;
  }

  /**
   * Check if a push notification is from HelpLane
   *
   * @param data The notification data payload
   * @returns True if this is a HelpLane notification
   */
  static isHelpLaneNotification(data: Record<string, unknown>): boolean {
    if (data.helplane === 'true') return true;
    if (data.type === 'new_message') return true;
    return false;
  }

  /**
   * Get the conversation ID from a HelpLane notification
   *
   * @param data The notification data payload
   * @returns The conversation ID, or null if not present
   */
  static getConversationId(data: Record<string, unknown>): string | null {
    return (data.conversation_id as string) || null;
  }

  /**
   * Get the message ID from a HelpLane notification
   *
   * @param data The notification data payload
   * @returns The message ID, or null if not present
   */
  static getMessageId(data: Record<string, unknown>): string | null {
    return (data.message_id as string) || null;
  }
}
