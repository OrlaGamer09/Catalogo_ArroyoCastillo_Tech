"use client"

import React from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { FileText, ShoppingBag, LogIn, MessageSquare, Copyright, Wifi, AlertCircle, RefreshCw, Mail } from "lucide-react"

const sections = [
  {
    number: "01",
    icon: ShoppingBag,
    title: "Objeto del sitio",
    content: (
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        <p>
          ACTechnology es un catálogo en línea de productos tecnológicos y accesorios electrónicos, incluyendo cargadores, cables, adaptadores y productos de la marca UGREEN.
        </p>
        <p>
          El sitio proporciona información sobre los productos y permite a los usuarios registrados compartir reseñas y valoraciones basadas en su experiencia.
        </p>
      </div>
    ),
  },
  {
    number: "02",
    icon: LogIn,
    title: "Registro e inicio de sesión",
    content: (
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        <p>Para publicar reseñas, los usuarios deberán autenticarse mediante una cuenta de Google.</p>
        <p>Al iniciar sesión, el usuario declara que la información proporcionada es veraz y que tiene autorización para utilizar la cuenta con la que accede.</p>
      </div>
    ),
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Reseñas y contenido generado por usuarios",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-5">El usuario es el único responsable del contenido que publique.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Permitido */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-green-500 mb-3">Permitido</p>
            <ul className="space-y-2">
              {["Calificaciones de productos", "Comentarios y opiniones", "Fotografías relacionadas con los productos"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* No permitido */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-destructive mb-3">No permitido</p>
            <ul className="space-y-2">
              {["Contenido falso o engañoso", "Contenido difamatorio u ofensivo", "Contenido ilegal o que infrinja derechos", "Contenido no relacionado con el catálogo"].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-muted-foreground border-l-2 border-primary/40 pl-4 italic">
          ACTechnology se reserva el derecho de editar, ocultar o eliminar cualquier contenido que considere inapropiado.
        </p>
      </>
    ),
  },
  {
    number: "04",
    icon: Copyright,
    title: "Propiedad intelectual",
    content: (
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        <p>
          Las marcas, imágenes, textos, logotipos y demás elementos presentes en el sitio pertenecen a sus respectivos propietarios y se utilizan únicamente con fines informativos y comerciales autorizados.
        </p>
        <p>
          Las reseñas y fotografías publicadas por los usuarios podrán ser mostradas dentro del sitio para informar a otros visitantes sobre la experiencia de uso de los productos.
        </p>
      </div>
    ),
  },
  {
    number: "05",
    icon: Wifi,
    title: "Disponibilidad del servicio",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        ACTechnology realiza esfuerzos razonables para mantener el sitio disponible y actualizado, pero no garantiza la disponibilidad ininterrumpida del servicio.
      </p>
    ),
  },
  {
    number: "06",
    icon: AlertCircle,
    title: "Limitación de responsabilidad",
    content: (
      <div className="space-y-3 text-muted-foreground leading-relaxed">
        <p>
          Las reseñas publicadas representan exclusivamente la opinión de sus autores y <strong className="text-foreground">no constituyen recomendaciones oficiales</strong> de ACTechnology.
        </p>
        <p>
          ACTechnology no será responsable por decisiones de compra tomadas por los usuarios basadas en opiniones publicadas por terceros.
        </p>
      </div>
    ),
  },
  {
    number: "07",
    icon: RefreshCw,
    title: "Modificaciones",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        ACTechnology podrá modificar estos términos en cualquier momento. Las modificaciones serán publicadas en esta misma página y entrarán en vigor desde su publicación.
      </p>
    ),
  },
  {
    number: "08",
    icon: Mail,
    title: "Contacto",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Para consultas relacionadas con estos términos y condiciones, puedes comunicarte a través de los canales oficiales publicados en el sitio web.
      </p>
    ),
  },
]

export default function PublicTermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery="" onSearchChange={() => {}} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero header */}
        <div className="flex items-start gap-5 mb-12 pb-10 border-b border-border">
          <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">ACTechnology</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">Términos y Condiciones de Uso</h1>
            <p className="text-sm text-muted-foreground">Última actualización: Junio de 2026</p>
          </div>
        </div>

        {/* Intro */}
        <div className="mb-10 p-5 rounded-xl bg-secondary/40 border border-border">
          <p className="text-muted-foreground leading-relaxed text-sm">
            Bienvenido a ACTechnology. Al acceder y utilizar este sitio web, aceptas los presentes Términos y Condiciones de Uso. Si no estás de acuerdo con alguno de estos términos, te recomendamos no utilizar el sitio.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map(({ number, icon: Icon, title, content }) => (
            <div key={number} className="group rounded-xl border border-border bg-card hover:border-primary/30 transition-colors duration-200 overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-4 border-b border-border bg-secondary/30">
                <span className="text-xs font-mono font-bold text-primary">{number}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold text-foreground text-sm">{title}</h2>
              </div>
              <div className="px-6 py-5">{content}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border bg-secondary/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">© 2026 Arroyo Castillo SAS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
