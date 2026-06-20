export interface Review {
  id: string
  product_id: number
  user_id: string
  author_name: string
  author_avatar: string | null
  rating: number
  comment: string | null
  photos: string[]
  created_at: string
  updated_at: string
}

export interface ReviewStats {
  average: number
  count: number
  /** distribution[5], distribution[4]... number of reviews per star rating */
  distribution: Record<number, number>
}

export function computeStats(reviews: Pick<Review, "rating">[]): ReviewStats {
  const count = reviews.length
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let total = 0
  for (const r of reviews) {
    distribution[r.rating] = (distribution[r.rating] ?? 0) + 1
    total += r.rating
  }
  const average = count > 0 ? total / count : 0
  return { average, count, distribution }
}

/** Build the public URL used to display a review photo stored in private Blob. */
export function photoUrl(pathname: string): string {
  return `/api/reviews/photo?pathname=${encodeURIComponent(pathname)}`
}
