import wikipedia from "wikipedia"
import {getWikipediaMainImage} from "@/services/wikipedia"
import axios from "axios"

export type Photo = {
  src: string
  width?: number
  height?: number
  attribution?: string
}

type PlaneSpottersThumbnail = {
  src: string
  size: {
    width: number
    height: number
  }
}

export type PlaneSpottersResponse = {
  photos: Array<{
    id: string
    thumbnail: PlaneSpottersThumbnail
    thumbnail_large: PlaneSpottersThumbnail
    link: string
    photographer: string
  }>
}

type GetPhotosParams = {
  hex: string
  description: string | undefined
  icaoType: string | undefined
}

export const getPhotos = async (params: GetPhotosParams): Promise<Photo[]> => {
  const {hex, icaoType, description} = params

  const planeSpottersResponse = await axios.get<PlaneSpottersResponse>(
    `https://api.planespotters.net/pub/photos/hex/${hex}`
  )

  if (planeSpottersResponse.data.photos.length > 0) {
    return planeSpottersResponse.data.photos.map((photo) => {
      const {src, size} = photo.thumbnail_large ?? photo.thumbnail
      return {
        src,
        width: size.width,
        height: size.height
        // attribution: `${photo.photographer} via PlaneSpotters.net`
      }
    })
  }

  searchWikipedia: {
    const search = description ?? icaoType
    if (!search) break searchWikipedia

    const wikipediaSearchResponse = await wikipedia.search(search)
    const articleTitle = wikipediaSearchResponse.results.at(0).title
    if (!articleTitle) break searchWikipedia

    const articleImages = await wikipedia.images(articleTitle)
    const mainImage = await getWikipediaMainImage(articleTitle)

    const photos: Photo[] = articleImages.map((imageResult) => ({
      src: imageResult.url
    }))

    if (mainImage) {
      photos.unshift({
        src: mainImage.source,
        width: mainImage.width,
        height: mainImage.height,
        attribution: `Wikipedia – ${articleTitle}`
      })
    }

    return photos
  }

  return []
}
