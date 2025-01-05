type Thumbnail = {
  src: string
  size: {
    width: number
    height: number
  }
}

export type Photo = {
  id: string
  thumbnail: Thumbnail
  thumbnail_large: Thumbnail
  link: string
  photographer: string
}

export type PhotosResponse = {
  photos: Photo[]
}
