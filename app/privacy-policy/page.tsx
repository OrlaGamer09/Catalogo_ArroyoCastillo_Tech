"use client"

import React from "react"
import { CatalogHeader } from "@/components/catalog-header"
import { Shield, Eye, Share2, Lock, Trash2, Cookie, Server, RefreshCw, Mail, Database } from "lucide-react"

const sections = [
  {
    number: "01",
    icon: Database,
    title: "Información que recopilamos",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Cuando un usuario inicia sesión mediante Google para publicar una reseña, podemos recopilar la siguiente información:
        </p>
        <ul className="space-y-2">
          {[
            "Nombre público asociado a la cuenta de Google",
            "Dirección de correo electrónico",
            "Fotografía de perfil (avatar)",
            "Información relacionada con las reseñas publicadas",
            "Fotografías adjuntas voluntariamente en las reseñas",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground border-l-2 border-primary/40 pl-4 italic">
          No solicitamos ni almacenamos contraseñas de Google.
        </p>
      </>
    ),
  },
  {
    number: "02",
    icon: Eye,
    title: "Finalidad del tratamiento de datos",
    content: (
      <ul className="space-y-2">
        {[
          "Identificar a los autores de las reseñas",
          "Mostrar reseñas auténticas a otros usuarios",
          "Incrementar la confianza y transparencia dentro del sitio",
          "Prevenir fraude, spam o publicaciones maliciosas",
          "Mejorar la experiencia de los visitantes",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    number: "03",
    icon: Eye,
    title: "Información visible públicamente",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Al publicar una reseña, los siguientes datos serán visibles para otros usuarios:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {[
            "Nombre del usuario",
            "Fotografía de perfil",
            "Calificación otorgada",
            "Comentario publicado",
            "Fotografías adjuntas",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 bg-secondary/60 rounded-lg px-3 py-2 text-sm text-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground border-l-2 border-primary/40 pl-4 italic">
          El correo electrónico no será mostrado públicamente.
        </p>
      </>
    ),
  },
  {
    number: "04",
    icon: Share2,
    title: "Compartición de información",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        ACTechnology <strong className="text-foreground">no vende, alquila ni comercializa</strong> los datos personales de los usuarios. La información únicamente podrá ser compartida cuando sea requerido por obligación legal o por una autoridad competente.
      </p>
    ),
  },
  {
    number: "05",
    icon: Lock,
    title: "Almacenamiento y seguridad",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        La información es almacenada utilizando proveedores tecnológicos que implementan medidas razonables de seguridad para proteger los datos contra accesos no autorizados, pérdida o alteración.
      </p>
    ),
  },
  {
    number: "06",
    icon: Trash2,
    title: "Eliminación de datos",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Los usuarios podrán solicitar la eliminación de sus reseñas y de la información asociada a su cuenta contactando a ACTechnology a través de los canales oficiales del sitio.
      </p>
    ),
  },
  {
    number: "07",
    icon: Cookie,
    title: "Cookies y tecnologías similares",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        El sitio puede utilizar cookies y tecnologías similares para mantener la sesión del usuario, mejorar el rendimiento y optimizar la experiencia de navegación.
      </p>
    ),
  },
  {
    number: "08",
    icon: Server,
    title: "Servicios de terceros",
    content: (
      <>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Para el funcionamiento de las reseñas y autenticación, el sitio utiliza los siguientes servicios:
        </p>
        <div className="flex flex-wrap gap-2">
          {["Google Authentication", "Supabase", "Vercel"].map((service) => (
            <span key={service} className="px-3 py-1.5 rounded-full border border-border bg-secondary/40 text-sm text-foreground font-medium">
              {service}
            </span>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Cada proveedor gestiona sus propios sistemas y políticas de privacidad.
        </p>
      </>
    ),
  },
  {
    number: "09",
    icon: RefreshCw,
    title: "Cambios a esta política",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        ACTechnology podrá actualizar esta Política de Privacidad en cualquier momento. La versión más reciente estará siempre disponible en esta página.
      </p>
    ),
  },
  {
    number: "10",
    icon: Mail,
    title: "Contacto",
    content: (
      <p className="text-muted-foreground leading-relaxed">
        Si tienes preguntas relacionadas con esta Política de Privacidad o el tratamiento de tus datos personales, puedes comunicarte con nosotros mediante los canales de contacto publicados en el sitio web.
      </p>
    ),
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery="" onSearchChange={() => {}} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero header */}
        <div className="flex items-start gap-5 mb-12 pb-10 border-b border-border">
          <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-1">ACTechnology</p>
            <h1 className="text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
            <p className="text-sm text-muted-foreground">Última actualización: Junio de 2026</p>
          </div>
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
