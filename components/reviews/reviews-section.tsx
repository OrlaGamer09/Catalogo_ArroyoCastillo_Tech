"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { MessageSquare, Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { computeStats, type Review } from "@/lib/reviews"
import { StarRating } from "@/components/reviews/star-rating"
import { ReviewItem } from "@/components/reviews/review-item"
import { ReviewForm } from "@/components/reviews/review-form"
import { useUser } from "@/hooks/use-user"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface ReviewsSectionProps {
  productId: number
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const { user, loading: userLoading } = useUser()
  const { data, isLoading, mutate } = useSWR<{ reviews: Review[] }>(
    `/api/reviews?productId=${productId}`,
    fetcher,
  )
  const [showForm, setShowForm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Review | null>(null)

  const reviews = data?.reviews ?? []
  const stats = useMemo(() => computeStats(reviews), [reviews])
  const myReview = user ? reviews.find((r) => r.user_id === user.id) ?? null : null

  const signIn = async () => {
    const supabase = createClient()
    const next = typeof window !== "undefined" ? window.location.pathname : "/"
    const base =
      process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`
    const redirectTo = `${base}${base.includes("?") ? "&" : "?"}next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })
    if (error) toast.error("No se pudo iniciar sesión con Google")
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/reviews?id=${confirmDelete.id}`, { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error || "No se pudo eliminar")
        return
      }
      toast.success("Reseña eliminada")
      setConfirmDelete(null)
      mutate()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="mt-16 lg:mt-24" id="reseñas">
      <h2 className="--font-poppins text-xl sm:text-2xl font-semibold text-foreground mb-6 text-center sm:text-left">Opiniones de clientes</h2>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6">
            {stats.count > 0 ? (
              <>
                <div className="flex items-baseline gap-2">
                  <span className="--font-poppins text-4xl font-bold text-foreground">
                    {stats.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">de 5</span>
                </div>
                <div className="mt-2">
                  <StarRating value={Math.round(stats.average)} size={18} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stats.count} {stats.count === 1 ? "reseña" : "reseñas"}
                </p>

                <div className="mt-5 space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = stats.count ? (stats.distribution[star] / stats.count) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-3 text-xs text-muted-foreground">{star}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right text-xs text-muted-foreground">
                          {stats.distribution[star]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Aún no hay reseñas. ¡Sé el primero en opinar!
                </p>
              </div>
            )}

            {!userLoading && !showForm && (
              <div className="mt-6 space-y-3">
                {user ? (
                  <>
                    <Button className="w-full" onClick={() => setShowForm(true)}>
                      {myReview ? "Editar mi reseña" : "Escribir una reseña"}
                    </Button>
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 px-3 py-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary uppercase">
                        {user.email?.slice(0, 2)}
                      </div>
                      <span className="flex-1 truncate text-xs text-muted-foreground">{user.email}</span>
                      <button
                        onClick={signOut}
                        title="Salir de cuenta"
                        className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Salir</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <Button className="w-full gap-2 bg-transparent hover:bg-secondary hover:text-foreground" variant="outline" onClick={signIn}>
                    <GoogleIcon />
                    Inicia sesión para opinar
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* List + form */}
        <div className="lg:col-span-2">
          {showForm && user && (
            <div className="mb-8">
              <ReviewForm
                productId={productId}
                existing={myReview}
                onSaved={() => {
                  setShowForm(false)
                  mutate()
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="rounded-xl border border-border bg-card px-5 sm:px-6">
              {reviews.map((review) => (
                <ReviewItem
                  key={review.id}
                  review={review}
                  isOwn={user?.id === review.user_id}
                  onEdit={() => setShowForm(true)}
                  onDelete={() => setConfirmDelete(review)}
                />
              ))}
            </div>
          ) : (
            !showForm && (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
                <MessageSquare className="mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-muted-foreground">Todavía no hay opiniones de este producto.</p>
              </div>
            )
          )}
        </div>
      </div>

      <AlertDialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar tu reseña?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Tu reseña y sus fotos se eliminarán permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}
