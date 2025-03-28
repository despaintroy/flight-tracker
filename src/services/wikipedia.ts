"use server"

import axios from "axios"
import {DeepNullable} from "@/lib/helpers"

type WikiQueryResponse = {
  batchcomplete: string
  query: {
    pages: {
      [pageId: string]: {
        pageid: number
        ns: number
        title: string
        thumbnail: {
          source: string
          width: number
          height: number
        }
        pageimage: string
      }
    }
  }
}

export const getWikipediaMainImage = async (
  articleTitle: string,
  size = 800
) => {
  // `https://en.wikipedia.org/w/api.php?action=query&titles=Airbus_A300-600_Freighter&prop=pageimages&format=json&pithumbsize=800`

  const url = new URL("https://en.wikipedia.org/w/api.php")
  url.searchParams.append("action", "query")
  url.searchParams.append("titles", articleTitle)
  url.searchParams.append("prop", "pageimages")
  url.searchParams.append("format", "json")
  url.searchParams.append("formatversion", "2")
  url.searchParams.append("pithumbsize", size.toString())

  const response = await axios.get<DeepNullable<WikiQueryResponse>>(
    url.toString()
  )
  const firstPage = Object.values(response.data.query?.pages ?? {}).at(0)

  return firstPage?.thumbnail
}
