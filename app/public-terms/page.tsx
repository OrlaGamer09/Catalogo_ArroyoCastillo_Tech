"use client"

import React from "react"
import { CatalogHeader } from "@/components/catalog-header"

export default function PublicTermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader searchQuery="" onSearchChange={() => {}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert mx-auto">
          <h1>Términos y Condiciones de Uso</h1>
          <p className="text-sm">Última actualización: Junio de 2026</p>

          <p>
            Bienvenido a ACTechnology. Al acceder y utilizar este sitio web, aceptas los presentes Términos y 
            Condiciones de Uso. Si no estás de acuerdo con alguno de estos términos, te recomendamos no utilizar el sitio.
          </p>

          <h2>1. Objeto del sitio</h2>
          <p>
            ACTechnology es un catálogo en línea de productos tecnológicos y accesorios electrónicos, incluyendo, 
            entre otros, cargadores, cables, adaptadores y productos de la marca UGREEN.
          </p>
          <p>
            El sitio proporciona información sobre los productos y permite a los usuarios registrados compartir 
            reseñas y valoraciones basadas en su experiencia.
          </p>

          <h2>2. Registro e inicio de sesión</h2>
          <p>
            Para publicar reseñas, los usuarios deberán autenticarse mediante una cuenta de Google.
          </p>
          <p>
            Al iniciar sesión, el usuario declara que la información proporcionada es veraz y que tiene autorización 
            para utilizar la cuenta con la que accede.
          </p>

          <h2>3. Reseñas y contenido generado por usuarios</h2>
          <p>Los usuarios pueden publicar:</p>
          <ul>
            <li>Calificaciones de productos.</li>
            <li>Comentarios y opiniones.</li>
            <li>Fotografías relacionadas con los productos.</li>
          </ul>
          <p>El usuario es el único responsable del contenido que publique.</p>
          <p>No está permitido publicar contenido:</p>
          <ul>
            <li>Falso o engañoso.</li>
            <li>Difamatorio u ofensivo.</li>
            <li>Ilegal o que infrinja derechos de terceros.</li>
            <li>No relacionado con los productos del catálogo.</li>
          </ul>
          <p>
            ACTechnology se reserva el derecho de editar, ocultar o eliminar cualquier contenido que considere inapropiado.
          </p>

          <h2>4. Propiedad intelectual</h2>
          <p>
            Las marcas, imágenes, textos, logotipos y demás elementos presentes en el sitio pertenecen a sus 
            respectivos propietarios y se utilizan únicamente con fines informativos y comerciales autorizados.
          </p>
          <p>
            Las reseñas y fotografías publicadas por los usuarios podrán ser mostradas dentro del sitio para informar 
            a otros visitantes sobre la experiencia de uso de los productos.
          </p>

          <h2>5. Disponibilidad del servicio</h2>
          <p>
            ACTechnology realiza esfuerzos razonables para mantener el sitio disponible y actualizado, pero no 
            garantiza la disponibilidad ininterrumpida del servicio.
          </p>

          <h2>6. Limitación de responsabilidad</h2>
          <p>
            Las reseñas publicadas representan exclusivamente la opinión de sus autores y no constituyen 
            recomendaciones oficiales de ACTechnology.
          </p>
          <p>
            ACTechnology no será responsable por decisiones de compra tomadas por los usuarios basadas en opiniones 
            publicadas por terceros.
          </p>

          <h2>7. Modificaciones</h2>
          <p>
            ACTechnology podrá modificar estos términos en cualquier momento. Las modificaciones serán publicadas en 
            esta misma página y entrarán en vigor desde su publicación.
          </p>

          <h2>8. Contacto</h2>
          <p>
            Para consultas relacionadas con estos términos y condiciones, puedes comunicarte a través de los canales 
            oficiales publicados en el sitio web.
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
