import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const ScannerCamera = ({ onScan }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode("reader");

    const config = {
      fps: 10, // Optional, frame per second for qr code scanning
      qrbox: { width: 250, height: 250 }, // Optional, if you want dark boundary box to highlight qr code
      aspectRatio: 16/9
    };

    const startScanning = () => {
      html5Qrcode.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          // Callback when QR code is successfully scanned
          onScan(decodedText);
        },
        (errorMessage) => {
          // Optional, callback when QR code scanning fails continuously
          // parseError: Optional, error from html5-qrcode library
          // console.warn(`Code scanning failed = ${errorMessage}`);
        }
      ).catch((err) => {
        // Start failed, handle it.
        console.error(`Unable to start scanning, error: ${err}`);
      });
    };

    startScanning();

    // Stop scanning when component unmounts
    return () => {
      html5Qrcode.stop().then(
        () => {
          // Clear to stop scanning
        }).catch((err) => {
          // Stop failed, handle it.
          console.error(`Unable to stop scanning, error: ${err}`);
        });
    };
  }, [onScan]);

  return (
    <div id="reader" style={{ width: '100%', height: '100%' }}></div>
  );
};

export default ScannerCamera;