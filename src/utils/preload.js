/** Preloads a list of image URLs and reports progress 0..1. */
export function preloadImages(urls, onProgress) {
  let done = 0;
  const total = urls.length || 1;
  return Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          const finish = () => {
            done += 1;
            if (onProgress) onProgress(done / total, src, img);
            resolve(img);
          };
          img.onload = finish;
          img.onerror = finish;
          img.decoding = 'async';
          img.src = src;
        })
    )
  );
}

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
