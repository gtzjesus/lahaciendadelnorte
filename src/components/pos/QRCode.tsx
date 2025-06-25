// components/QRCode.tsx
import { QRCodeCanvas } from 'qrcode.react';

type QRCodeProps = {
  value: string; // The text to encode in the QR code
  size?: number; // Optional size of the QR code in pixels
};

export default function QRCode({ value, size = 128 }: QRCodeProps) {
  return <QRCodeCanvas value={value} size={size} />;
}
