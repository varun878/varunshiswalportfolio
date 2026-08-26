import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  Check, 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Ratio, 
  RefreshCw,
  Crop as CropIcon
} from 'lucide-react';

export type AspectRatioType = '1:1' | '16:9' | '4:3' | '3:2' | '9:16' | 'free';

interface ImageCropperModalProps {
  imageSrc: string;
  initialRatio?: AspectRatioType;
  title?: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onClose: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  imageSrc,
  initialRatio = 'free',
  title = 'Adjust Frame & Crop Image',
  onCropComplete,
  onClose
}) => {
  const [selectedRatio, setSelectedRatio] = useState<AspectRatioType>(initialRatio);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Image load details
  const [imageLoaded, setImageLoaded] = useState(false);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);

  // Canvas & container refs
  const containerRef = useRef<HTMLDivElement>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  // Crop rectangle state in normalized container coordinates [0..1]
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8
  });

  // Interaction tracking
  const [isDragging, setIsDragging] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; crop: typeof crop }>({
    x: 0,
    y: 0,
    crop: { x: 0, y: 0, width: 0, height: 0 }
  });

  // Ratio definitions
  const ratioPresets: { key: AspectRatioType; label: string; ratioVal: number | null }[] = [
    { key: '1:1', label: '1:1 (Square)', ratioVal: 1 },
    { key: '16:9', label: '16:9 (Landscape)', ratioVal: 16 / 9 },
    { key: '4:3', label: '4:3 (Standard)', ratioVal: 4 / 3 },
    { key: '3:2', label: '3:2 (Classic)', ratioVal: 3 / 2 },
    { key: '9:16', label: '9:16 (Portrait)', ratioVal: 9 / 16 },
    { key: 'free', label: 'Free Ratio', ratioVal: null }
  ];

  // Helper to adjust crop rect to given aspect ratio within bounds
  const applyRatioToCrop = useCallback((ratio: AspectRatioType, currentCrop = crop) => {
    const preset = ratioPresets.find(r => r.key === ratio);
    if (!preset || preset.ratioVal === null) return;

    const targetRatio = preset.ratioVal;
    let newWidth = currentCrop.width;
    let newHeight = currentCrop.width / targetRatio;

    if (newHeight > 0.95) {
      newHeight = 0.9;
      newWidth = newHeight * targetRatio;
    }
    if (newWidth > 0.95) {
      newWidth = 0.9;
      newHeight = newWidth / targetRatio;
    }

    const newX = Math.max(0.02, Math.min(0.98 - newWidth, (1 - newWidth) / 2));
    const newY = Math.max(0.02, Math.min(0.98 - newHeight, (1 - newHeight) / 2));

    setCrop({
      x: newX,
      y: newY,
      width: Math.min(newWidth, 0.96),
      height: Math.min(newHeight, 0.96)
    });
  }, [crop]);

  // Handle ratio change
  const handleRatioChange = (ratioKey: AspectRatioType) => {
    setSelectedRatio(ratioKey);
    if (ratioKey !== 'free') {
      applyRatioToCrop(ratioKey);
    }
  };

  // When image loads
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    imageElementRef.current = img;
    setNaturalWidth(img.naturalWidth);
    setNaturalHeight(img.naturalHeight);
    setImageLoaded(true);

    if (initialRatio !== 'free') {
      applyRatioToCrop(initialRatio, { x: 0.1, y: 0.1, width: 0.8, height: 0.8 });
    } else {
      setCrop({ x: 0.05, y: 0.05, width: 0.9, height: 0.9 });
    }
  };

  // Mouse & Touch handling for crop box movement & resizing
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent, handle: string | null = null) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    setActiveHandle(handle);
    setDragStart({
      x: clientX,
      y: clientY,
      crop: { ...crop }
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const deltaX = (clientX - dragStart.x) / rect.width;
      const deltaY = (clientY - dragStart.y) / rect.height;

      const initial = dragStart.crop;
      const preset = ratioPresets.find(r => r.key === selectedRatio);
      const forcedRatio = preset?.ratioVal ?? null;

      if (!activeHandle) {
        // Moving whole crop box
        const maxX = 1 - initial.width;
        const maxY = 1 - initial.height;
        setCrop({
          ...initial,
          x: Math.max(0, Math.min(maxX, initial.x + deltaX)),
          y: Math.max(0, Math.min(maxY, initial.y + deltaY))
        });
      } else {
        // Resizing with specific handles
        let newX = initial.x;
        let newY = initial.y;
        let newWidth = initial.width;
        let newHeight = initial.height;

        if (activeHandle.includes('e')) {
          newWidth = Math.max(0.1, Math.min(1 - initial.x, initial.width + deltaX));
        }
        if (activeHandle.includes('s')) {
          newHeight = Math.max(0.1, Math.min(1 - initial.y, initial.height + deltaY));
        }
        if (activeHandle.includes('w')) {
          const maxDelta = initial.width - 0.1;
          const actualDelta = Math.max(-initial.x, Math.min(maxDelta, deltaX));
          newX = initial.x + actualDelta;
          newWidth = initial.width - actualDelta;
        }
        if (activeHandle.includes('n')) {
          const maxDelta = initial.height - 0.1;
          const actualDelta = Math.max(-initial.y, Math.min(maxDelta, deltaY));
          newY = initial.y + actualDelta;
          newHeight = initial.height - actualDelta;
        }

        // Apply aspect ratio lock if active
        if (forcedRatio !== null) {
          if (activeHandle === 'se' || activeHandle === 'e' || activeHandle === 's') {
            newHeight = newWidth / forcedRatio;
            if (newY + newHeight > 1) {
              newHeight = 1 - newY;
              newWidth = newHeight * forcedRatio;
            }
          } else if (activeHandle === 'nw' || activeHandle === 'w' || activeHandle === 'n') {
            newHeight = newWidth / forcedRatio;
          }
        }

        // Constrain within bounds
        newWidth = Math.max(0.08, Math.min(1 - newX, newWidth));
        newHeight = Math.max(0.08, Math.min(1 - newY, newHeight));

        setCrop({
          x: Math.max(0, Math.min(1 - newWidth, newX)),
          y: Math.max(0, Math.min(1 - newHeight, newY)),
          width: newWidth,
          height: newHeight
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setActiveHandle(null);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, activeHandle, dragStart, selectedRatio]);

  // Execute Canvas Crop & Export
  const handleExecuteCrop = () => {
    if (!imageElementRef.current || !containerRef.current) return;

    const img = imageElementRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate source rect in natural image pixels
    // Take zoom, rotation, and crop into account
    const srcX = crop.x * naturalWidth;
    const srcY = crop.y * naturalHeight;
    const srcW = crop.width * naturalWidth;
    const srcH = crop.height * naturalHeight;

    // Target canvas dimensions
    const targetW = Math.round(srcW);
    const targetH = Math.round(srcH);

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.save();
    // Center transformation
    ctx.translate(targetW / 2, targetH / 2);

    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    if (flipH || flipV) {
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    }

    // Draw the cropped portion
    ctx.drawImage(
      img,
      srcX,
      srcY,
      srcW,
      srcH,
      -targetW / 2,
      -targetH / 2,
      targetW,
      targetH
    );

    ctx.restore();

    // Export as crisp JPEG or PNG
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCropComplete(croppedUrl);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    if (initialRatio !== 'free') {
      applyRatioToCrop(initialRatio);
    } else {
      setCrop({ x: 0.05, y: 0.05, width: 0.9, height: 0.9 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0a0e14]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-[#3b82f6]">
              <CropIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-tight">{title}</h3>
              <p className="text-[11px] text-[#9ca3af]">Adjust aspect ratio, zoom, rotation, and crop boundaries</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close cropper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Toolbar */}
        <div className="px-5 py-3 bg-[#0d121c] border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-[#9ca3af] uppercase tracking-wider mr-1 flex items-center gap-1">
              <Ratio className="w-3.5 h-3.5 text-[#3b82f6]" />
              <span>Ratio:</span>
            </span>
            {ratioPresets.map((preset) => {
              const active = selectedRatio === preset.key;
              return (
                <button
                  key={preset.key}
                  onClick={() => handleRatioChange(preset.key)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#3b82f6] text-white shadow-sm'
                      : 'bg-[#111827] text-gray-400 hover:text-gray-200 border border-white/5'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRotation((r) => (r - 90) % 360)}
              className="p-1.5 rounded bg-[#111827] hover:bg-gray-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
              title="Rotate Left 90°"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1.5 rounded bg-[#111827] hover:bg-gray-800 text-gray-300 hover:text-white border border-white/5 transition-colors"
              title="Rotate Right 90°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFlipH(!flipH)}
              className={`p-1.5 rounded border border-white/5 transition-colors ${
                flipH ? 'bg-blue-600/30 text-blue-400 border-blue-500/40' : 'bg-[#111827] hover:bg-gray-800 text-gray-300'
              }`}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              className="p-1.5 rounded bg-[#111827] hover:bg-gray-800 text-gray-400 hover:text-white border border-white/5 transition-colors"
              title="Reset Controls"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Cropping Workspace */}
        <div className="relative flex-1 min-h-[340px] max-h-[50vh] sm:max-h-[58vh] bg-[#070a0e] flex items-center justify-center p-4 overflow-hidden select-none">
          <div
            ref={containerRef}
            className="relative max-w-full max-h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* The Image */}
            <img
              src={imageSrc}
              alt="Source for cropping"
              onLoad={handleImageLoad}
              style={{
                transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                maxHeight: '48vh',
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block'
              }}
              className="pointer-events-none rounded shadow"
            />

            {/* Dark Shaded Overlay Outside the Crop Box */}
            {imageLoaded && (
              <>
                <div
                  className="absolute inset-0 bg-black/60 pointer-events-none"
                  style={{
                    clipPath: `polygon(
                      0% 0%, 
                      100% 0%, 
                      100% 100%, 
                      0% 100%, 
                      0% 0%, 
                      ${crop.x * 100}% ${crop.y * 100}%, 
                      ${crop.x * 100}% ${(crop.y + crop.height) * 100}%, 
                      ${(crop.x + crop.width) * 100}% ${(crop.y + crop.height) * 100}%, 
                      ${(crop.x + crop.width) * 100}% ${crop.y * 100}%, 
                      ${crop.x * 100}% ${crop.y * 100}%
                    )`
                  }}
                />

                {/* Active Interactive Crop Box */}
                <div
                  onMouseDown={(e) => handleMouseDown(e, null)}
                  onTouchStart={(e) => handleMouseDown(e, null)}
                  className="absolute border-2 border-[#3b82f6] shadow-2xl cursor-move z-20 group"
                  style={{
                    left: `${crop.x * 100}%`,
                    top: `${crop.y * 100}%`,
                    width: `${crop.width * 100}%`,
                    height: `${crop.height * 100}%`
                  }}
                >
                  {/* Grid Lines (Rule of Thirds) */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-r border-b border-white/40" />
                    <div className="border-b border-white/40" />
                    <div className="border-r border-white/40" />
                    <div className="border-r border-white/40" />
                    <div />
                  </div>

                  {/* Corner Resize Handles */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'nw')}
                    onTouchStart={(e) => handleMouseDown(e, 'nw')}
                    className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#3b82f6] rounded-sm cursor-nwse-resize shadow"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'ne')}
                    onTouchStart={(e) => handleMouseDown(e, 'ne')}
                    className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#3b82f6] rounded-sm cursor-nesw-resize shadow"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'sw')}
                    onTouchStart={(e) => handleMouseDown(e, 'sw')}
                    className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-[#3b82f6] rounded-sm cursor-nesw-resize shadow"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'se')}
                    onTouchStart={(e) => handleMouseDown(e, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-[#3b82f6] rounded-sm cursor-nwse-resize shadow"
                  />

                  {/* Edge Resize Handles */}
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'n')}
                    onTouchStart={(e) => handleMouseDown(e, 'n')}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-[#3b82f6] rounded-sm cursor-ns-resize"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 's')}
                    onTouchStart={(e) => handleMouseDown(e, 's')}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-[#3b82f6] rounded-sm cursor-ns-resize"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'w')}
                    onTouchStart={(e) => handleMouseDown(e, 'w')}
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#3b82f6] rounded-sm cursor-ew-resize"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDown(e, 'e')}
                    onTouchStart={(e) => handleMouseDown(e, 'e')}
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-6 bg-[#3b82f6] rounded-sm cursor-ew-resize"
                  />

                  {/* Dimensions badge inside crop */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white pointer-events-none">
                    {Math.round(crop.width * naturalWidth)} × {Math.round(crop.height * naturalHeight)} px
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer & Controls */}
        <div className="px-5 py-4 bg-[#0a0e14] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Zoom Slider */}
          <div className="flex items-center gap-3 w-full sm:w-64">
            <ZoomOut className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="range"
              min="0.6"
              max="2.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-gray-800 rounded-lg"
            />
            <ZoomIn className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400 font-mono w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#111827] text-gray-300 hover:text-white border border-white/5 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteCrop}
              className="inline-flex items-center gap-1.5 px-6 py-2 rounded-lg bg-[#3b82f6] hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Crop</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
