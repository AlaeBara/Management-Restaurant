import React from 'react';
import { Detector } from 'react-detect-offline';
import { WifiOff } from 'lucide-react';

const CheckConnection = (props) => {
  return (
    <Detector
      render={({ online }) => {
        return (
          <div >
            {online ? (
              props.children
            ) : (
              <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <WifiOff size={48} color="#ff4500" />
                    </div>
                    <h1 style={{ marginBottom: '8px', fontSize: '24px' }}>No Connection</h1>
                    <h4 style={{ margin: '0', fontSize: '16px', color: '#6b7280' }}>
                      Please check your internet connection
                    </h4>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      }}
    />
  );
};

export default CheckConnection;
