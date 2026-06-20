import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          No pudimos iniciar sesión
        </h1>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          Ocurrió un problema al autenticar tu cuenta de Google. Por favor
          vuelve a intentarlo desde la página del producto.
        </p>
        <Button asChild>
          <Link href="/">Volver al catálogo</Link>
        </Button>
      </div>
    </div>
  )
}
