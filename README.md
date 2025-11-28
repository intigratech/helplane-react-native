# @helplane/react-native

Add live chat support to your React Native app with the HelpLane SDK.

## Requirements

- React Native 0.60+
- react-native-webview 11.0+

## Installation

```bash
npm install @helplane/react-native react-native-webview
# or
yarn add @helplane/react-native react-native-webview
```

### iOS Setup

```bash
cd ios && pod install
```

## Quick Start

### 1. Wrap Your App with the Provider

```tsx
import { HelpLaneProvider } from '@helplane/react-native';

export default function App() {
  return (
    <HelpLaneProvider brandToken="your-brand-token">
      <YourApp />
    </HelpLaneProvider>
  );
}
```

### 2. Identify Users (Optional)

```tsx
import { useHelpLane } from '@helplane/react-native';

function ProfileScreen() {
  const { identify } = useHelpLane();

  useEffect(() => {
    identify({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    });
  }, []);

  return <View>...</View>;
}
```

### 3. Show the Chat

```tsx
import { HelpLaneChat, useHelpLane } from '@helplane/react-native';

// Option 1: Use the chat component directly
function SupportScreen() {
  return <HelpLaneChat style={{ flex: 1 }} />;
}

// Option 2: Use the hook to control visibility
function App() {
  const { openChat } = useHelpLane();

  return (
    <Button title="Get Help" onPress={openChat} />
  );
}
```

## Push Notifications

HelpLane uses OneSignal for push notifications:

```tsx
import { HelpLanePush } from '@helplane/react-native';
import OneSignal from 'react-native-onesignal';

// After OneSignal setup
HelpLanePush.register();

// Handle notification tap
OneSignal.setNotificationOpenedHandler((event) => {
  if (HelpLanePush.isHelpLaneNotification(event.notification)) {
    // Navigate to chat screen
    navigation.navigate('Support');
  }
});
```

## Configuration Options

```tsx
<HelpLaneProvider
  brandToken="your-brand-token"
  baseURL="https://your-instance.helplane.io"  // Optional
  user={{  // Optional: pre-set user
    id: 'user-123',
    name: 'John Doe',
  }}
>
  <App />
</HelpLaneProvider>
```

## API Reference

### HelpLaneProvider Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `brandToken` | string | Yes | Your HelpLane brand token |
| `baseURL` | string | No | Custom instance URL |
| `user` | HelpLaneUser | No | Pre-identified user |
| `children` | ReactNode | Yes | Your app components |

### useHelpLane Hook

```tsx
const {
  identify,    // (user: HelpLaneUser) => void
  clearUser,   // () => void
  openChat,    // () => void
  closeChat,   // () => void
  isOpen,      // boolean
} = useHelpLane();
```

### HelpLaneChat Props

| Prop | Type | Description |
|------|------|-------------|
| `style` | ViewStyle | Container style |
| `onLoad` | () => void | Called when chat loads |
| `onError` | (error) => void | Called on error |

### HelpLaneUser

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique user identifier |
| `name` | string | Display name |
| `email` | string | Email address |
| `avatarURL` | string | Profile image URL |
| `customAttributes` | object | Custom data |

## TypeScript

Full TypeScript support is included. Import types:

```tsx
import type { HelpLaneUser, HelpLaneConfig } from '@helplane/react-native';
```

## Support

- Documentation: [docs.helplane.io](https://docs.helplane.io)
- Issues: [GitHub Issues](https://github.com/intigratech/helplane-react-native/issues)

## License

MIT License - see [LICENSE](LICENSE) for details.
