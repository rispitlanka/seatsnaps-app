import { Platform, type KeyboardAvoidingViewProps } from 'react-native';

/**
 * iOS needs the view padded above the keyboard.
 * Android uses a resizing window (`softwareKeyboardLayoutMode: "resize"`),
 * so an extra offset would push the fields too far.
 */
export const keyboardBehavior: KeyboardAvoidingViewProps['behavior'] =
  Platform.OS === 'ios' ? 'padding' : undefined;
