import React from 'react';

const BackgroundPattern: React.FC = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 820"
        preserveAspectRatio="xMidYMid slice"
        style={{
          display: 'block',
        }}
      >
        <defs>
          <style>
            {`
              @keyframes scale1 {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
              }
              @keyframes scale2 {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.15); }
              }
              @keyframes scale3 {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
              }
              @keyframes scale4 {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.25); }
              }
              @keyframes scale5 {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
              }
              .animate-scale1 { animation: scale1 4s ease-in-out infinite; transform-origin: center; }
              .animate-scale2 { animation: scale2 4.5s ease-in-out infinite; transform-origin: center; }
              .animate-scale3 { animation: scale3 5s ease-in-out infinite; transform-origin: center; }
              .animate-scale4 { animation: scale4 5.5s ease-in-out infinite; transform-origin: center; }
              .animate-scale5 { animation: scale5 6s ease-in-out infinite; transform-origin: center; }
            `}
          </style>
          <filter x="0%" y="0%" width="100%" height="100%" id="c38c61717a">
            <feColorMatrix
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
              colorInterpolationFilters="sRGB"
            />
          </filter>
        </defs>
        <g className="animate-scale1">
          <rect x="100" y="100" width="200" height="200" fill="#b51e3e" fillOpacity="0.1" />
        </g>
        <g className="animate-scale2">
          <rect x="400" y="150" width="300" height="300" fill="#b51e3e" fillOpacity="0.1" />
        </g>
        <g className="animate-scale3">
          <rect x="800" y="200" width="400" height="400" fill="#b51e3e" fillOpacity="0.1" />
        </g>
        <g className="animate-scale4">
          <rect x="1200" y="250" width="500" height="500" fill="#b51e3e" fillOpacity="0.1" />
        </g>
        <g className="animate-scale5">
          <rect x="1600" y="300" width="600" height="600" fill="#b51e3e" fillOpacity="0.1" />
        </g>
      </svg>
    </div>
  );
};

export default BackgroundPattern; 