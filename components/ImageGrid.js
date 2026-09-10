// Lays out 1-3 character images. With 3, uses a hero + two stacked
// thumbnails collage instead of plain equal columns.

export default function ImageGrid({ images, onDownload, className = "" }) {
  const n = images.length;

  const layoutClass =
    n === 1
      ? "grid grid-cols-1"
      : n === 2
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-3 grid-rows-2 gap-2 aspect-[4/5]";

  return (
    <div className={`${layoutClass} ${className}`}>
      {images.map((img, idx) => {
        const spanClass = n === 3 ? (idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1") : "";
        const aspectClass = n === 3 ? "" : "aspect-[3/4]";
        return (
          <div key={idx} className={`relative overflow-hidden rounded-lg ${spanClass} ${aspectClass}`}>
            <img src={img.dataUrl} alt={`variation ${idx + 1}`} className="h-full w-full object-cover" />
            {onDownload && (
              <button
                onClick={() => onDownload(idx)}
                className="no-print absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white backdrop-blur"
              >
                Download
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
