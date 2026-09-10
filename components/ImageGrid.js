// Lays out 1-3 character images. With 3, the first (a 4:3 landscape hero
// shot) sits on the left and the other two stack on the right — a shorter,
// wider block than plain equal columns, leaving room for text below it.

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

export default function ImageGrid({ images, onDownload, className = "" }) {
  const n = images.length;

  if (n === 3) {
    return (
      <div className={`flex aspect-[3/2] gap-2 ${className}`}>
        <ImageTile img={images[0]} idx={0} onDownload={onDownload} className="flex-[1.6]" />
        <div className="flex flex-1 flex-col gap-2">
          <ImageTile img={images[1]} idx={1} onDownload={onDownload} className="flex-1" />
          <ImageTile img={images[2]} idx={2} onDownload={onDownload} className="flex-1" />
        </div>
      </div>
    );
  }

  const layoutClass = n === 1 ? "grid grid-cols-1" : "grid grid-cols-2 gap-2";

  return (
    <div className={`${layoutClass} ${className}`}>
      {images.map((img, idx) => (
        <ImageTile key={idx} img={img} idx={idx} onDownload={onDownload} className="aspect-[3/4]" />
      ))}
    </div>
  );
}
