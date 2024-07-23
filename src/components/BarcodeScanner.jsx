import React, { useState } from 'react';
import { useZxing } from 'react-zxing';

export const BarcodeScanner = ({ onScanResult }) => {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText();
      setResult(scannedText);
      if (onScanResult) {
        onScanResult(scannedText);
      }
    },
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <video ref={ref} style={{ width: '100%', height: '100%' }} />

    </div>
  );
};