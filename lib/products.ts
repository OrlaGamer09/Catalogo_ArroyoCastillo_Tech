export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
  fullDescription: string
  specs: ProductSpec[]
  features: string[]
}

export const products: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Max",
    price: 3499,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop",
    description: "Potencia profesional con chip M3 Max, pantalla Liquid Retina XDR y hasta 22 horas de batería",
    fullDescription: "El MacBook Pro de 16 pulgadas con chip M3 Max representa la cúspide del rendimiento portátil. Diseñado para profesionales creativos, desarrolladores y usuarios que exigen lo máximo de su equipo. Con su pantalla Liquid Retina XDR de 16.2 pulgadas, cada detalle cobra vida con colores vibrantes y negros profundos. El chip M3 Max ofrece un rendimiento sin precedentes para tareas intensivas como edición de video 8K, modelado 3D y compilación de código.",
    specs: [
      { label: "Procesador", value: "Apple M3 Max (16 núcleos)" },
      { label: "Memoria RAM", value: "48GB Memoria Unificada" },
      { label: "Almacenamiento", value: "1TB SSD" },
      { label: "Pantalla", value: "16.2\" Liquid Retina XDR (3456x2234)" },
      { label: "GPU", value: "40 núcleos GPU" },
      { label: "Batería", value: "Hasta 22 horas" },
      { label: "Peso", value: "2.14 kg" },
      { label: "Puertos", value: "3x Thunderbolt 4, HDMI, SD, MagSafe 3" }
    ],
    features: [
      "Pantalla ProMotion con tasa de refresco adaptativa hasta 120Hz",
      "Sistema de sonido de seis altavoces con audio espacial",
      "Cámara FaceTime HD 1080p con procesamiento avanzado",
      "Touch ID para autenticación segura",
      "Teclado Magic Keyboard con retroiluminación",
      "WiFi 6E y Bluetooth 5.3"
    ]
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max",
    price: 1199,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    description: "Titanio de grado aeroespacial, chip A17 Pro y el sistema de cámara más avanzado",
    fullDescription: "El iPhone 15 Pro Max redefine lo que un smartphone puede hacer. Construido con titanio de grado aeroespacial, es el iPhone más ligero y resistente jamás creado. El chip A17 Pro, fabricado con tecnología de 3nm, ofrece un rendimiento gráfico revolucionario que permite gaming de nivel consola. Su sistema de cámara pro con zoom óptico 5x captura detalles increíbles incluso a distancia, mientras que el nuevo botón de Acción te permite personalizar funciones al instante.",
    specs: [
      { label: "Procesador", value: "A17 Pro (3nm)" },
      { label: "Memoria RAM", value: "8GB" },
      { label: "Almacenamiento", value: "256GB / 512GB / 1TB" },
      { label: "Pantalla", value: "6.7\" Super Retina XDR OLED" },
      { label: "Cámara Principal", value: "48MP f/1.78" },
      { label: "Cámara Teleobjetivo", value: "12MP 5x zoom óptico" },
      { label: "Batería", value: "Hasta 29 horas video" },
      { label: "Conectividad", value: "5G, WiFi 6E, USB-C 3.0" }
    ],
    features: [
      "Cuerpo de titanio de grado aeroespacial",
      "Dynamic Island para notificaciones interactivas",
      "Botón de Acción personalizable",
      "Grabación de video ProRes y Log",
      "Modo Cine 4K a 30fps",
      "Detección de accidentes y SOS emergencia vía satélite"
    ]
  },
  {
    id: 3,
    name: "Sony WH-1000XM5",
    price: 349,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
    description: "Auriculares inalámbricos con cancelación de ruido líder en la industria",
    fullDescription: "Los Sony WH-1000XM5 establecen el nuevo estándar en auriculares premium con cancelación de ruido. Equipados con dos procesadores que controlan 8 micrófonos, ofrecen la mejor cancelación de ruido que Sony ha creado. El diseño completamente rediseñado es más ligero y cómodo para uso prolongado, mientras que la calidad de audio Hi-Res con tecnología LDAC garantiza cada detalle de tu música. Con hasta 30 horas de batería y carga rápida, son el compañero perfecto para el día a día.",
    specs: [
      { label: "Driver", value: "30mm con diafragma de fibra de carbono" },
      { label: "Respuesta de frecuencia", value: "4Hz - 40,000Hz" },
      { label: "Cancelación de ruido", value: "8 micrófonos + 2 procesadores" },
      { label: "Batería", value: "Hasta 30 horas (ANC activo)" },
      { label: "Carga rápida", value: "3 min = 3 horas de uso" },
      { label: "Peso", value: "250g" },
      { label: "Bluetooth", value: "5.2 con multipoint" },
      { label: "Códecs", value: "SBC, AAC, LDAC" }
    ],
    features: [
      "Cancelación de ruido líder en la industria",
      "Audio Hi-Res certificado con LDAC",
      "Speak-to-Chat pausa automática al hablar",
      "Conexión multipunto a 2 dispositivos",
      "Control táctil intuitivo",
      "Diseño plegable para portabilidad"
    ]
  },
  {
    id: 4,
    name: "iPad Pro 12.9\" M2",
    price: 1099,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop",
    description: "Pantalla Liquid Retina XDR, chip M2 y compatibilidad con Apple Pencil Pro",
    fullDescription: "El iPad Pro de 12.9 pulgadas con chip M2 es la tablet más potente del mundo. Su pantalla Liquid Retina XDR con tecnología mini-LED ofrece un brillo extremo de 1600 nits HDR y una relación de contraste de 1,000,000:1. El chip M2 proporciona rendimiento de nivel desktop, permitiendo ejecutar aplicaciones profesionales como Logic Pro, Final Cut Pro y flujos de trabajo de diseño 3D. Con Apple Pencil Pro y el nuevo Magic Keyboard, transforma completamente tu productividad.",
    specs: [
      { label: "Procesador", value: "Apple M2 (8 núcleos)" },
      { label: "Memoria RAM", value: "8GB / 16GB" },
      { label: "Almacenamiento", value: "128GB a 2TB" },
      { label: "Pantalla", value: "12.9\" Liquid Retina XDR (2732x2048)" },
      { label: "Brillo", value: "1000 nits SDR / 1600 nits HDR" },
      { label: "Cámara", value: "12MP Wide + 10MP Ultra Wide + LiDAR" },
      { label: "Batería", value: "Hasta 10 horas" },
      { label: "Conectividad", value: "WiFi 6E, 5G opcional, Thunderbolt/USB 4" }
    ],
    features: [
      "Pantalla mini-LED con ProMotion 120Hz",
      "Face ID para autenticación segura",
      "Compatible con Apple Pencil Pro (hover)",
      "Centro de Atención para videollamadas",
      "Cuatro altavoces con audio espacial",
      "Thunderbolt para conectar displays externos"
    ]
  },
  {
    id: 5,
    name: "Samsung Galaxy S24 Ultra",
    price: 1299,
    category: "Smartphones",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop",
    description: "Galaxy AI integrado, cámara de 200MP y S Pen incluido",
    fullDescription: "El Samsung Galaxy S24 Ultra representa el futuro de la inteligencia móvil. Con Galaxy AI integrado, ofrece traducción en tiempo real de llamadas, edición de fotos potenciada por IA y búsqueda inteligente con Circle to Search. Su cámara principal de 200MP captura detalles extraordinarios, mientras que el marco de titanio y la pantalla Gorilla Armor garantizan durabilidad excepcional. El S Pen integrado y la pantalla QHD+ de 6.8 pulgadas lo convierten en la herramienta definitiva de productividad.",
    specs: [
      { label: "Procesador", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { label: "Memoria RAM", value: "12GB" },
      { label: "Almacenamiento", value: "256GB / 512GB / 1TB" },
      { label: "Pantalla", value: "6.8\" Dynamic AMOLED 2X QHD+" },
      { label: "Cámara Principal", value: "200MP f/1.7 OIS" },
      { label: "Zoom Óptico", value: "5x (50MP periscopio)" },
      { label: "Batería", value: "5000mAh, carga 45W" },
      { label: "S Pen", value: "Incluido con latencia 2.8ms" }
    ],
    features: [
      "Galaxy AI: traducción en tiempo real, edición IA",
      "Circle to Search con Google",
      "Marco de titanio grado 4",
      "Pantalla Gorilla Armor antirreflejos",
      "Video 8K a 30fps",
      "Resistencia IP68"
    ]
  },
  {
    id: 6,
    name: "Apple Watch Ultra 2",
    price: 799,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
    description: "El Apple Watch más resistente y capaz, diseñado para la aventura",
    fullDescription: "El Apple Watch Ultra 2 está diseñado para los atletas, aventureros y exploradores más exigentes. Con su caja de titanio de 49mm, pantalla de 3000 nits (la más brillante de Apple) y certificación de buceo EN13319, está listo para cualquier desafío. El nuevo chip S9 permite interacciones con doble toque sin tocar la pantalla, mientras que el GPS de doble frecuencia ofrece la ubicación más precisa. Con hasta 36 horas de batería en uso normal y 72 horas en modo ahorro, nunca te dejará tirado.",
    specs: [
      { label: "Procesador", value: "Apple S9 SiP con Neural Engine" },
      { label: "Caja", value: "49mm Titanio" },
      { label: "Pantalla", value: "OLED LTPO2 hasta 3000 nits" },
      { label: "Resistencia", value: "100m agua, MIL-STD-810H" },
      { label: "GPS", value: "Doble frecuencia L1+L5" },
      { label: "Batería", value: "36h normal / 72h ahorro" },
      { label: "Sensores", value: "ECG, SpO2, temperatura, profundidad" },
      { label: "Conectividad", value: "Cellular, WiFi, Bluetooth 5.3" }
    ],
    features: [
      "Gesto Doble Toque para control sin manos",
      "Sirena de 86 decibelios para emergencias",
      "Botón de Acción programable",
      "App Oceanic+ para buceo certificado",
      "Detección de accidentes automovilísticos",
      "Modo Noche con pantalla roja"
    ]
  },
  {
    id: 7,
    name: "Dell XPS 15 OLED",
    price: 1899,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&h=800&fit=crop",
    description: "Pantalla OLED 3.5K táctil, Intel Core i7 de 13ª generación",
    fullDescription: "El Dell XPS 15 OLED combina potencia y elegancia en un diseño ultracompacto. Su impresionante pantalla OLED de 3.5K con bordes InfinityEdge ofrece colores 100% DCI-P3 y negros perfectos, ideal para creadores de contenido y profesionales del color. El procesador Intel Core i7 de 13ª generación junto con la GPU NVIDIA GeForce RTX 4060 manejan sin esfuerzo edición de video, diseño 3D y gaming. El chasis de aluminio mecanizado CNC y la cubierta de fibra de carbono crean un laptop tan hermoso como potente.",
    specs: [
      { label: "Procesador", value: "Intel Core i7-13700H (14 núcleos)" },
      { label: "Memoria RAM", value: "32GB DDR5 4800MHz" },
      { label: "Almacenamiento", value: "1TB NVMe SSD" },
      { label: "Pantalla", value: "15.6\" OLED 3.5K (3456x2160) táctil" },
      { label: "GPU", value: "NVIDIA GeForce RTX 4060 6GB" },
      { label: "Batería", value: "86Wh, hasta 13 horas" },
      { label: "Peso", value: "1.86 kg" },
      { label: "Puertos", value: "2x Thunderbolt 4, USB-C 3.2, SD" }
    ],
    features: [
      "Pantalla OLED con 100% DCI-P3 y DisplayHDR 500",
      "Teclado retroiluminado con lector de huellas",
      "Webcam FHD con Windows Hello IR",
      "Altavoces quad con Waves MaxxAudio",
      "Diseño CNC de aluminio y fibra de carbono",
      "Dell ComfortView Plus para reducción de luz azul"
    ]
  },
  {
    id: 8,
    name: "AirPods Pro 2",
    price: 249,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800&h=800&fit=crop",
    description: "Audio espacial personalizado, cancelación activa de ruido y chip H2",
    fullDescription: "Los AirPods Pro de segunda generación con chip H2 ofrecen la experiencia de audio inalámbrico más avanzada de Apple. La cancelación activa de ruido es hasta 2 veces más efectiva que la generación anterior, mientras que el modo Transparencia Adaptativa reduce los ruidos fuertes del entorno de forma inteligente. El Audio Espacial Personalizado crea un perfil único para tu anatomía auditiva, ofreciendo una experiencia inmersiva incomparable. El estuche con USB-C incluye un altavoz y soporte para Find My con localización precisa.",
    specs: [
      { label: "Chip", value: "Apple H2" },
      { label: "Driver", value: "Driver de bajo de Apple + amplificador" },
      { label: "ANC", value: "2x más efectiva que generación anterior" },
      { label: "Batería auriculares", value: "6 horas (ANC activo)" },
      { label: "Batería total", value: "30 horas con estuche" },
      { label: "Carga", value: "USB-C, MagSafe, Qi" },
      { label: "Resistencia", value: "IPX4 auriculares y estuche" },
      { label: "Controles", value: "Táctil + control de volumen deslizante" }
    ],
    features: [
      "Cancelación activa de ruido 2x mejorada",
      "Modo Transparencia Adaptativa",
      "Audio Espacial Personalizado",
      "Control de volumen táctil en el vástago",
      "Estuche con altavoz y Find My",
      "Detección automática de oído"
    ]
  },
  {
    id: 9,
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 1199,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=800&h=800&fit=crop",
    description: "Pantalla Dynamic AMOLED 2X de 14.6\", S Pen incluido y resistencia IP68",
    fullDescription: "La Samsung Galaxy Tab S9 Ultra es la tablet Android más ambiciosa jamás creada. Su masiva pantalla Dynamic AMOLED 2X de 14.6 pulgadas con tasa de refresco de 120Hz es perfecta para multitarea, entretenimiento y creatividad profesional. El procesador Snapdragon 8 Gen 2 for Galaxy ofrece rendimiento de nivel gaming, mientras que el S Pen incluido con latencia ultra baja de 2.8ms permite notas y dibujos precisos. Es la primera tablet Samsung con certificación IP68, resistiendo agua y polvo sin compromisos.",
    specs: [
      { label: "Procesador", value: "Snapdragon 8 Gen 2 for Galaxy" },
      { label: "Memoria RAM", value: "12GB / 16GB" },
      { label: "Almacenamiento", value: "256GB / 512GB / 1TB + microSD" },
      { label: "Pantalla", value: "14.6\" Dynamic AMOLED 2X (2960x1848)" },
      { label: "Tasa de refresco", value: "120Hz adaptativo" },
      { label: "Cámara", value: "Dual 13MP + 8MP trasera, Dual 12MP frontal" },
      { label: "Batería", value: "11,200mAh, carga 45W" },
      { label: "S Pen", value: "Incluido, latencia 2.8ms" }
    ],
    features: [
      "Primera tablet Samsung con IP68",
      "Samsung DeX para experiencia desktop",
      "Multi-ventana para hasta 3 apps simultáneas",
      "Altavoces quad AKG con Dolby Atmos",
      "Reconocimiento facial y huella bajo pantalla",
      "Second Screen para usar como monitor externo"
    ]
  },
  {
    id: 10,
    name: "Bose QuietComfort Ultra",
    price: 429,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
    description: "Audio inmersivo espacial con la mejor cancelación de ruido del mundo",
    fullDescription: "Los Bose QuietComfort Ultra Headphones representan el pináculo de la ingeniería de audio de Bose. Introducen Bose Immersive Audio, una tecnología revolucionaria que crea una experiencia de sonido espacial personalizada sin necesidad de seguimiento de cabeza. La cancelación de ruido, ya legendaria en Bose, alcanza nuevos niveles de silencio con los modos Quiet y Aware personalizables. El diseño premium con almohadillas de proteína de cuero sintético ofrece comodidad durante todo el día, mientras que la batería de 24 horas te mantiene conectado.",
    specs: [
      { label: "Driver", value: "Drivers TriPort de Bose" },
      { label: "Inmersive Audio", value: "Bose Immersive Audio espacial" },
      { label: "Cancelación de ruido", value: "CustomTune con calibración personal" },
      { label: "Batería", value: "24 horas (18h con Immersive Audio)" },
      { label: "Carga rápida", value: "15 min = 2.5 horas" },
      { label: "Peso", value: "250g" },
      { label: "Bluetooth", value: "5.3 con multipoint" },
      { label: "Códecs", value: "SBC, AAC, aptX Adaptive" }
    ],
    features: [
      "Bose Immersive Audio para sonido espacial",
      "CustomTune calibra audio y ANC a tu oído",
      "Modo Aware ajustable para transparencia",
      "Almohadillas de proteína de cuero sintético",
      "Controles táctiles intuitivos",
      "Ecualización ajustable en app Bose Music"
    ]
  },
  {
    id: 11,
    name: "Microsoft Surface Pro 9",
    price: 1599,
    category: "Tablets",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&h=800&fit=crop",
    description: "Versatilidad 2 en 1, Intel Core i7 y pantalla PixelSense Flow de 13\"",
    fullDescription: "La Microsoft Surface Pro 9 es la tablet 2-en-1 definitiva que combina la portabilidad de una tablet con la potencia de un laptop. Su pantalla PixelSense Flow de 13 pulgadas con tasa de refresco de 120Hz ofrece una experiencia visual fluida y vibrante, mientras que el procesador Intel Core i7 de 12ª generación maneja cualquier tarea profesional. Con Windows 11 Pro, acceso completo a aplicaciones de escritorio, y compatibilidad con Surface Slim Pen 2 y Type Cover, transforma tu flujo de trabajo.",
    specs: [
      { label: "Procesador", value: "Intel Core i7-1255U (10 núcleos)" },
      { label: "Memoria RAM", value: "16GB / 32GB LPDDR5" },
      { label: "Almacenamiento", value: "256GB / 512GB / 1TB SSD" },
      { label: "Pantalla", value: "13\" PixelSense Flow (2880x1920) 120Hz" },
      { label: "Cámara frontal", value: "5MP + Windows Hello IR" },
      { label: "Cámara trasera", value: "10MP con 4K video" },
      { label: "Batería", value: "Hasta 15.5 horas" },
      { label: "Puertos", value: "2x Thunderbolt 4, Surface Connect" }
    ],
    features: [
      "Pantalla táctil 120Hz con soporte stylus",
      "Windows Hello con reconocimiento facial",
      "Kickstand integrado ajustable 180°",
      "Soporte para Surface Slim Pen 2 (háptico)",
      "Altavoces Dolby Atmos 2.0",
      "Disponible en múltiples colores"
    ]
  },
  {
    id: 12,
    name: "Garmin Fenix 7X Pro",
    price: 899,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop",
    description: "GPS multibanda, linterna LED integrada y métricas avanzadas de entrenamiento",
    fullDescription: "El Garmin Fenix 7X Pro Solar es el reloj multideporte definitivo para atletas serios y aventureros. Con GPS multibanda de alta precisión, mapas TopoActive preinstalados y una linterna LED integrada con modos rojo y blanco, está preparado para cualquier expedición. El cristal Power Glass con carga solar extiende la batería hasta 37 días en modo smartwatch. Las métricas avanzadas de entrenamiento, incluyendo Training Readiness, HRV Status y Stamina en tiempo real, te ayudan a optimizar cada sesión.",
    specs: [
      { label: "Pantalla", value: "1.4\" MIP transflectiva (280x280)" },
      { label: "Caja", value: "51mm titanio o acero, cristal zafiro" },
      { label: "GPS", value: "Multibanda (GPS, GLONASS, Galileo)" },
      { label: "Batería smartwatch", value: "Hasta 37 días (28 sin solar)" },
      { label: "Batería GPS", value: "Hasta 122 horas con solar" },
      { label: "Resistencia", value: "10 ATM (100m)" },
      { label: "Mapas", value: "TopoActive globales + SkiView" },
      { label: "Linterna", value: "LED blanca/roja con modo SOS" }
    ],
    features: [
      "Carga solar Power Glass para batería extendida",
      "Linterna LED integrada con múltiples modos",
      "Training Readiness y HRV Status diario",
      "Stamina en tiempo real durante actividad",
      "ClimbPro con ascensos restantes",
      "Música offline (hasta 2000 canciones)"
    ]
  }
]

export const categories = [...new Set(products.map((p) => p.category))]

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}
