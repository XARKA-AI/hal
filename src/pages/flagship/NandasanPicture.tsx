import {
  NANDASAN_IMAGE_HEIGHT,
  NANDASAN_IMAGE_WIDTH,
  publicImagePath,
} from "./nandasan-content"

interface NandasanPictureProps {
  file: string
  alt: string
  className?: string
  sizes: string
  /** Above-the-fold — eager load + high fetch priority. */
  priority?: boolean
}

export function NandasanPicture({
  file,
  alt,
  className,
  sizes,
  priority = false,
}: NandasanPictureProps) {
  return (
    <img
      src={publicImagePath(file)}
      alt={alt}
      width={NANDASAN_IMAGE_WIDTH}
      height={NANDASAN_IMAGE_HEIGHT}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
