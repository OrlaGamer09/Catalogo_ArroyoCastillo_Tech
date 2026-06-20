"use client"

import React from "react"
import { CatalogHeader } from "@/components/catalog-header"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery="" onSearchChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert mx-auto">
          <h1>Política de Privacidad</h1>
          <p className="text-sm">Última actualización: Junio de 2026</p>

          <h2>1. Información que recopilamos</h2>
          <p>
            Cuando un usuario inicia sesión mediante Google para publicar una reseña, podemos
            recopilar la siguiente información:
          </p>
          <ul>
            <li>Nombre público asociado a la cuenta de Google.</li>
            <li>Dirección de correo electrónico.</li>
            <li>Fotografía de perfil (avatar).</li>
            <li>Información relacionada con las reseñas publicadas.</li>
            <li>Fotografías adjuntas voluntariamente en las reseñas.</li>
          </ul>
          <p>No solicitamos ni almacenamos contraseñas de Google.</p>

          <h2>2. Finalidad del tratamiento de datos</h2>
          <p>La información recopilada se utiliza exclusivamente para:</p>
          <ul>
            <li>Identificar a los autores de las reseñas.</li>
            <li>Mostrar reseñas auténticas a otros usuarios.</li>
            <li>Incrementar la confianza y transparencia dentro del sitio.</li>
            <li>Prevenir fraude, spam o publicaciones maliciosas.</li>
            <li>Mejorar la experiencia de los visitantes.</li>
          </ul>

          <h2>3. Información visible públicamente</h2>
          <p>
            Al publicar una reseña, podrán mostrarse públicamente:
          </p>
          <ul>
            <li>Nombre del usuario.</li>
            <li>Fotografía de perfil.</li>
            <li>Calificación otorgada.</li>
            <li>Comentario publicado.</li>
            <li>Fotografías adjuntas por el usuario.</li>
          </ul>
          <p>El correo electrónico no será mostrado públicamente.</p>

          <h2>4. Compartición de información</h2>
          <p>ACTechnology no vende, alquila ni comercializa los datos personales de los usuarios.</p>
          <p>
            La información únicamente podrá ser compartida cuando sea requerido por obligación legal o
            por una autoridad competente.
          </p>

          <h2>5. Almacenamiento y seguridad</h2>
          <p>
            La información es almacenada utilizando proveedores tecnológicos que implementan medidas
            razonables de seguridad para proteger los datos contra accesos no autorizados, pérdida o
            alteración.
          </p>

          <h2>6. Eliminación de datos</h2>
          <p>
            Los usuarios podrán solicitar la eliminación de sus reseñas y de la información asociada a
            su cuenta contactando a ACTechnology a través de los canales oficiales del sitio.
          </p>

          <h2>7. Cookies y tecnologías similares</h2>
          <p>
            El sitio puede utilizar cookies y tecnologías similares para mantener la sesión del
            usuario, mejorar el rendimiento y optimizar la experiencia de navegación.
          </p>

          <h2>8. Servicios de terceros</h2>
          <p>
            Para el funcionamiento de las reseñas y autenticación, el sitio puede utilizar servicios de
            terceros como:
          </p>
          <ul>
            <li>Google Authentication.</li>
            <li>Supabase.</li>
            <li>Vercel.</li>
          </ul>
          <p>Cada proveedor gestiona sus propios sistemas y políticas de privacidad.</p>

          <h2>9. Cambios a esta política</h2>
          <p>
            ACTechnology podrá actualizar esta Política de Privacidad en cualquier momento. La versión
            más reciente estará siempre disponible en esta página.
          </p>

          <h2>10. Contacto</h2>
          <p>
            Si tienes preguntas relacionadas con esta Política de Privacidad o el tratamiento de tus
            datos personales, puedes comunicarte con nosotros mediante los canales de contacto
            publicados en el sitio web.
          </p>
        </div>
      </main>

      <footer className="border-t border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">© 2026 Arroyo Castillo SAS. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
