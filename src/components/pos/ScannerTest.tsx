'use client';

import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function ScannerTest() {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: 250 },
      true // verbose logging on
    );

    scanner.render(
      (decodedText) => {
        console.log('✅ Decoded Text:', decodedText);
        alert(`Decoded QR Code: ${decodedText}`);
      },
      (error) => {
        console.warn('⚠️ QR Scan Error:', error);
      }
    );

    return () => {
      scanner
        .clear()
        .catch((err) => console.error('Failed to clear scanner', err));
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>QR Code Scanner Test</h1>
      <div id="reader" style={{ width: '300px', margin: 'auto' }}></div>
      <p>Point your camera at a QR code to test scanning.</p>
    </div>
  );
}
