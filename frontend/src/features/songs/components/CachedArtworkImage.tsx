import { useEffect, useState, type ImgHTMLAttributes } from "react";

type CachedArtworkImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

type CachedImageRecord =
  | { status: "loading"; promise: Promise<string> }
  | { status: "loaded"; objectUrl: string }
  | { status: "failed" };

const cachedImages = new Map<string, CachedImageRecord>();

const fetchImage = async (src: string) => {
  const response = await fetch(src, { cache: "force-cache", mode: "cors" });

  if (!response.ok) {
    throw new Error(`Image source returned ${response.status}`);
  }

  const blob = await response.blob();

  if (blob.type && !blob.type.startsWith("image/")) {
    throw new Error("Image source did not return an image.");
  }

  return URL.createObjectURL(blob);
};

const readCachedImage = (src: string) => {
  const cached = cachedImages.get(src);

  if (cached?.status === "loaded") {
    return Promise.resolve(cached.objectUrl);
  }

  if (cached?.status === "loading") {
    return cached.promise;
  }

  if (cached?.status === "failed") {
    return Promise.reject(new Error("Image source is using the browser fallback."));
  }

  const promise = fetchImage(src)
    .then((objectUrl) => {
      cachedImages.set(src, { status: "loaded", objectUrl });
      return objectUrl;
    })
    .catch((error: unknown) => {
      cachedImages.set(src, { status: "failed" });
      throw error;
    });

  cachedImages.set(src, { status: "loading", promise });
  return promise;
};

const getDisplaySrc = (src: string) => {
  const cached = cachedImages.get(src);

  if (cached?.status === "loaded") {
    return cached.objectUrl;
  }

  if (cached?.status === "failed") {
    return src;
  }

  return undefined;
};

export const clearCachedArtworkImages = () => {
  for (const cached of cachedImages.values()) {
    if (cached.status === "loaded") {
      URL.revokeObjectURL(cached.objectUrl);
    }
  }

  cachedImages.clear();
};

export const CachedArtworkImage = ({ src, ...imageProps }: CachedArtworkImageProps) => {
  const [displaySrc, setDisplaySrc] = useState(() => getDisplaySrc(src));

  useEffect(() => {
    let isCurrent = true;
    setDisplaySrc(getDisplaySrc(src));

    readCachedImage(src)
      .then((cachedSrc) => {
        if (isCurrent) {
          setDisplaySrc(cachedSrc);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setDisplaySrc(src);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [src]);

  return <img {...imageProps} src={displaySrc} />;
};
