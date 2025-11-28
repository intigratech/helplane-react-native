import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useHelpLane } from './HelpLaneProvider';
import type { HelpLaneChatProps } from './types';

/**
 * HelpLane chat component that displays the chat widget in a WebView
 */
export function HelpLaneChat({
  visible,
  onClose,
  onLoad,
  onError,
  style,
}: HelpLaneChatProps) {
  const { config, user } = useHelpLane();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = config.baseUrl || 'https://api.helplane.io';

  const settings = useMemo(() => {
    const s: Record<string, unknown> = {
      brandToken: config.brandToken,
      baseUrl,
      embedded: true,
      autoOpen: true,
      hideLauncher: true,
    };

    if (user) {
      if (user.userId) s.userID = user.userId;
      if (user.email) s.email = user.email;
      if (user.name) s.name = user.name;
      if (user.phone) s.phone = user.phone;
      if (user.tier) s.tier = user.tier;
      if (user.meta) s.meta = user.meta;
    }

    return s;
  }, [config, user, baseUrl]);

  const html = useMemo(() => {
    const settingsJson = JSON.stringify(settings);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: transparent;
          }
          #helplane-widget-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          [data-helplane-launcher] {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <script>
          window.HelpLaneSettings = ${settingsJson};

          // Listen for close events from widget
          window.addEventListener('helplane:close', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'close' }));
          });
        </script>
        <script src="${baseUrl}/api/widget/client.js" defer></script>
      </body>
      </html>
    `;
  }, [settings, baseUrl]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(
    (syntheticEvent: { nativeEvent: { description: string } }) => {
      const err = new Error(syntheticEvent.nativeEvent.description);
      setLoading(false);
      setError(err);
      onError?.(err);
    },
    [onError]
  );

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === 'close') {
          onClose?.();
        }
      } catch {
        // Ignore non-JSON messages
      }
    },
    [onClose]
  );

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    webViewRef.current?.reload();
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, style]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Support</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0066cc" />
            </View>
          )}

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorTitle}>Connection Error</Text>
              <Text style={styles.errorMessage}>
                Unable to load chat. Please check your internet connection.
              </Text>
              <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <WebView
              ref={webViewRef}
              source={{ html, baseUrl }}
              style={styles.webView}
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState={false}
              scalesPageToFit={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              bounces={false}
              scrollEnabled={false}
              onLoad={handleLoad}
              onError={handleError}
              onMessage={handleMessage}
              // iOS specific
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              // Android specific
              mixedContentMode="never"
              thirdPartyCookiesEnabled
              cacheEnabled
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/**
 * Standalone chat component (without Modal wrapper)
 * Use this if you want to embed the chat in your own view hierarchy
 */
export function HelpLaneChatView({
  onLoad,
  onError,
  style,
}: Omit<HelpLaneChatProps, 'visible' | 'onClose'>) {
  const { config, user } = useHelpLane();
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const baseUrl = config.baseUrl || 'https://api.helplane.io';

  const settings = useMemo(() => {
    const s: Record<string, unknown> = {
      brandToken: config.brandToken,
      baseUrl,
      embedded: true,
      autoOpen: true,
      hideLauncher: true,
    };

    if (user) {
      if (user.userId) s.userID = user.userId;
      if (user.email) s.email = user.email;
      if (user.name) s.name = user.name;
      if (user.phone) s.phone = user.phone;
      if (user.tier) s.tier = user.tier;
      if (user.meta) s.meta = user.meta;
    }

    return s;
  }, [config, user, baseUrl]);

  const html = useMemo(() => {
    const settingsJson = JSON.stringify(settings);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body { width: 100%; height: 100%; overflow: hidden; background: transparent; }
          #helplane-widget-container {
            position: fixed !important;
            top: 0 !important; left: 0 !important;
            right: 0 !important; bottom: 0 !important;
            width: 100% !important; height: 100% !important;
          }
          [data-helplane-launcher] { display: none !important; }
        </style>
      </head>
      <body>
        <script>window.HelpLaneSettings = ${settingsJson};</script>
        <script src="${baseUrl}/api/widget/client.js" defer></script>
      </body>
      </html>
    `;
  }, [settings, baseUrl]);

  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(null);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(
    (syntheticEvent: { nativeEvent: { description: string } }) => {
      const err = new Error(syntheticEvent.nativeEvent.description);
      setLoading(false);
      setError(err);
      onError?.(err);
    },
    [onError]
  );

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    webViewRef.current?.reload();
  }, []);

  return (
    <View style={[styles.content, style]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>
            Unable to load chat. Please check your internet connection.
          </Text>
          <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
          source={{ html, baseUrl }}
          style={styles.webView}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
          scalesPageToFit={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={false}
          onLoad={handleLoad}
          onError={handleError}
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="never"
          thirdPartyCookiesEnabled
          cacheEnabled
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#0066cc',
  },
  content: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
