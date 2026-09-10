// Lays out 1-3 character images. With 3, the first (a 4:3 landscape hero
// shot) sits on the left and the other two stack on the right.
//
// By default each layout sizes itself via aspect-ratio (used on the
// generator's result card). Pass `fillHeight` to instead have the whole
// grid fill its parent's height exactly — used on the catalog page so the
// image area always occupies a fixed fraction of the A4 page regardless of
// how many images there are.

function ImageTile({ img, idx, onDownload, className }) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
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
}

export default function ImageGrid({ images, onDownload, className = "", fillHeight = false }) {
  const n = images.length;
  const tileClass = fillHeight ? "h-full" : "aspect-[3/4]";

  if (n === 3) {
    return (
      <div className={`flex gap-2 ${fillHeight ? "h-full" : "aspect-[3/2]"} ${className}`}>
        <ImageTile img={images[0]} idx={0} onDownload={onDownload} className="flex-[1.6]" />
        <div className="flex flex-1 flex-col gap-2">
          <ImageTile img={images[1]} idx={1} onDownload={onDownload} className="flex-1" />
          <ImageTile img={images[2]} idx={2} onDownload={onDownload} className="flex-1" />
        </div>
      </div>
    );
  }

  if (n === 2) {
    return (
      <div className={`grid grid-cols-2 gap-2 ${fillHeight ? "h-full" : ""} ${className}`}>
        <ImageTile img={images[0]} idx={0} onDownload={onDownload} className={tileClass} />
        <ImageTile img={images[1]} idx={1} onDownload={onDownload} className={tileClass} />
      </div>
    );
  }

  return (
    <div className={`${fillHeight ? "h-full" : ""} ${className}`}>
      <ImageTile img={images[0]} idx={0} onDownload={onDownload} className={tileClass} />
    </div>
  );
}
