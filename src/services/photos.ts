import axios from "axios"
import {PhotosResponse} from "@/services/photosTypes"

type GetPhotosParams = {
  hex: string
}

export const getPhotos = async (
  params: GetPhotosParams
): Promise<PhotosResponse> => {
  const {hex} = params
  const response = await axios.get<PhotosResponse>(
    `https://api.planespotters.net/pub/photos/hex/${hex}`
  )
  return response.data
}
