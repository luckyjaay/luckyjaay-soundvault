import React, { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
  label?: string;
}

export const AdsterraBanner: React.FC<AdsterraBannerProps> = ({
  adKey,
  width,
  height,
  className = '',
  label = 'Sponsored Ad',
}) => {
  // Use srcDoc iframe to isolate document.write from the main React DOM
  const srcDoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '${adKey}',
      'format' : 'iframe',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://bauval.org/22/${adKey}"></script>
</body>
</html>`;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {label && (
        <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
          <span>{label}</span>
        </div>
      )}
      <div
        className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-lg flex items-center justify-center"
        style={{ width: `${width}px`, height: `${height}px`, maxWidth: '100%' }}
      >
        <iframe
          title={`Adsterra Ad ${adKey}`}
          srcDoc={srcDoc}
          width={width}
          height={height}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            border: 0,
            overflow: 'hidden',
            display: 'block',
          }}
          scrolling="no"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
};

// Convenient exports with the exact keys provided by user:
// 1. Preview 320x50 Ad
export const ADSTERRA_PREVIEW_KEY = '93ee41cfd75e5e7740148ed1aa6ade92';
export const AdsterraPreviewBanner: React.FC<{ className?: string; label?: string }> = ({
  className,
  label = 'Sponsored Adsterra Preview Banner (320x50)',
}) => (
  <AdsterraBanner
    adKey={ADSTERRA_PREVIEW_KEY}
    width={320}
    height={50}
    className={className}
    label={label}
  />
);

// 2. Medium Rectangle 300x250 Ad
export const ADSTERRA_RECTANGLE_KEY = 'a6e83be80d05d4ca6372199109ac5826';
export const AdsterraRectangleBanner: React.FC<{ className?: string; label?: string }> = ({
  className,
  label = 'Sponsored Music Partner (300x250)',
}) => (
  <AdsterraBanner
    adKey={ADSTERRA_RECTANGLE_KEY}
    width={300}
    height={250}
    className={className}
    label={label}
  />
);
