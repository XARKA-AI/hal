import {
  CLUSTER_C_IMAGE_HEIGHT,
  CLUSTER_C_IMAGE_WIDTH,
  publicImagePath,
} from "./cluster-c-content"

interface ClusterCPictureProps {
  file: string
  alt: string
  className?: string
  sizes: string
  priority?: boolean
}

export function ClusterCPicture({
  file,
  alt,
  className,
  sizes,
  priority = false,
}: ClusterCPictureProps) {
  return (
    <img
      src={publicImagePath(file)}
      alt={alt}
      width={CLUSTER_C_IMAGE_WIDTH}
      height={CLUSTER_C_IMAGE_HEIGHT}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  )
}
