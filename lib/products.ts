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
  name: "Cargador UGREEN Uno v2.0 30W GaN",
  price: 100000,
  category: "Cargadores",
  image: "/robotGaN2.png",
  description: "Cargador USB-C compacto de 30W con tecnología GaN Nexode Robot. Carga rápida para iPhone, Samsung Galaxy, Pixel y más.",
  fullDescription: "El UGREEN Uno Charger de 30W es la solución ideal para quienes buscan potencia sin sacrificar espacio. Gracias a la tecnología Nexode Robot GaN, este cargador logra entregar 30W de carga rápida en un bloque notablemente más compacto que los cargadores tradicionales. Compatible con una amplia gama de dispositivos: iPhone 15/14/13, Samsung Galaxy S24/S23/S22, Google Pixel 7/8 y cualquier dispositivo con carga USB-C. Perfecto para el hogar, la oficina o como compañero de viaje.",
  specs: [
    { label: "Potencia", value: "30W" },
    { label: "Tecnología", value: "GaN (Nitruro de Galio) Nexode Robot" },
    { label: "Puerto", value: "1x USB-C" },
    { label: "Voltaje de salida", value: "5V/3A, 9V/3A, 15V/2A, 20V/1.5A" },
    { label: "Protocolo de carga", value: "USB Power Delivery 3.0 (PD)" },
    { label: "Color", value: "Negro" },
    { label: "Compatibilidad", value: "iPhone, Samsung Galaxy, Google Pixel, iPad, MacBook y más" },
    { label: "Entrada", value: "USB-C" }
  ],
  features: [
    "Tecnología GaN para mayor eficiencia y menor calor generado",
    "Carga un iPhone 15 al 50% en aproximadamente 30 minutos",
    "Diseño ultracompacto, ideal para viajes",
    "Compatible con USB Power Delivery 3.0",
    "Protección contra sobrecorriente, sobrevoltaje y sobrecalentamiento",
    "Compatible con iPhone 15/14/13, Galaxy S24/S23/S22, Pixel 7/8"
  ]
},
{
  id: 2,
  name: "Cargador UGREEN 30W GaN 3 Puertos (2C + 1A)",
  price: 70000,
  category: "Cargadores",
  image: "/Cargador3in1_30W.png", // reemplaza con el nombre real
  description: "Cargador GaN de 30W con 3 puertos (2x USB-C + 1x USB-A). Carga hasta 3 dispositivos simultáneamente. Compatible con iPhone, Galaxy, MacBook Air, iPad y más.",
  fullDescription: "El cargador UGREEN 30W GaN es la solución perfecta cuando necesitas cargar varios dispositivos a la vez sin ocupar múltiples enchufes. Con 2 puertos USB-C y 1 puerto USB-A, puedes conectar hasta 3 dispositivos al mismo tiempo: tu smartphone, tablet y audífonos, por ejemplo. Gracias a la tecnología GaN, entrega 30W de potencia máxima en un bloque compacto que genera menos calor que los cargadores convencionales. Carga un iPhone 17 de 0% a 60% en solo 30 minutos.",
  specs: [
    { label: "Potencia máxima", value: "30W" },
    { label: "Tecnología", value: "GaN (Nitruro de Galio)" },
    { label: "Puertos", value: "2x USB-C + 1x USB-A (3 puertos en total)" },
    { label: "Voltaje de entrada", value: "240V AC" },
    { label: "Corriente máxima", value: "3A" },
    { label: "Color", value: "Negro" },
    { label: "Contenido", value: "1 bloque cargador + manual de usuario" },
    { label: "Compatibilidad", value: "iPhone, Samsung Galaxy, MacBook Air, iPad Pro y más" }
  ],
  features: [
    "3 puertos simultáneos: carga tu teléfono, tablet y accesorios al mismo tiempo",
    "Carga un iPhone 17 de 0% a 60% en solo 30 minutos",
    "Tecnología GaN: más compacto y menos calor que cargadores tradicionales",
    "2 puertos USB-C + 1 puerto USB-A para máxima versatilidad",
    "Compatible con iPhone 17/16/15/14, Galaxy S25/S24/S23/S22/S21, MacBook Air, iPad Pro",
    "Protección integrada contra sobrecorriente, sobrevoltaje y sobrecalentamiento"
  ]
},
{
  id: 3,
  name: "Cargador de Carro UGREEN 30W USB-C PD + USB-A QC",
  price: 55000,
  category: "Cargadores",
  image: "/CargadorCarro30W.png", // reemplaza con el nombre real
  description: "Cargador de carro de 30W con puerto USB-C PD y USB-A QC. Carga 2 dispositivos simultáneamente con carga rápida en movimiento.",
  fullDescription: "El Cargador de Carro UGREEN de 30W es la solución perfecta para mantener tus dispositivos cargados mientras estás en la carretera. Con un puerto USB-C Power Delivery y un puerto USB-A Quick Charge, puedes cargar dos dispositivos a la vez de forma rápida y eficiente. Su diseño compacto y minimalista se adapta a cualquier puerto de encendedor de vehículo sin estorbar, y sus múltiples protecciones integradas garantizan una carga segura tanto para tus dispositivos como para el sistema eléctrico de tu vehículo.",
  specs: [
    { label: "Potencia total", value: "30W máx." },
    { label: "Puerto USB-C", value: "Power Delivery (PD) — carga rápida" },
    { label: "Puerto USB-A", value: "Quick Charge (QC) — carga rápida" },
    { label: "Total de puertos", value: "2 (1x USB-C + 1x USB-A)" },
    { label: "Conexión al vehículo", value: "Puerto encendedor de cigarrillos" },
    { label: "Compatibilidad", value: "Smartphones, tablets, GPS y gadgets USB-C/USB-A" }
  ],
  features: [
    "30W de potencia total para cargar 2 dispositivos simultáneamente",
    "Puerto USB-C PD para carga rápida de smartphones e iPads modernos",
    "Puerto USB-A QC para máxima compatibilidad con dispositivos de cualquier generación",
    "Diseño compacto que se adapta a cualquier interior de vehículo",
    "Protección contra sobrecarga, sobrecalentamiento y cortocircuito",
    "Ideal para viajes largos, trabajo en carretera y uso diario"
  ]
},
{
  id: 4,
  name: "Cable UGREEN USB-C a USB-C Trenzado 60W PD",
  price: 30000,
  category: "Cables",
  image: "/cable60W.png", // reemplaza con el nombre real
  description: "Cable USB-C trenzado de 60W con PD y Quick Charge 4.0. Carga y sincronización para iPhone, Galaxy, iPad, MacBook y más.",
  fullDescription: "El cable UGREEN USB-C a USB-C de 60W combina carga rápida y transferencia de datos en un solo accesorio duradero. Gracias a su soporte para Power Delivery hasta 60W (20V/3A), puede cargar un iPhone 16 de 0% a 60% en solo 30 minutos, y también es compatible con portátiles, tablets y smartphones con puerto USB-C. Su exterior de nylon trenzado, conectores dorados y carcasa de aleación de aluminio están diseñados para soportar más de 10.000 conexiones sin degradarse. La resistencia integrada de 56K ohmios protege tus dispositivos de daños por sobrecorriente.",
  specs: [
    { label: "Potencia máxima", value: "60W (20V/3A)" },
    { label: "Protocolo de carga", value: "USB Power Delivery 3.0, Quick Charge 4.0, AFC" },
    { label: "Transferencia de datos", value: "Hasta 480 Mbps" },
    { label: "Corriente máxima", value: "3A (protegida a 2.4A con resistencia 56KΩ)" },
    { label: "Conectores", value: "USB-C a USB-C" },
    { label: "Material exterior", value: "Nylon trenzado" },
    { label: "Conectores", value: "Aleación de aluminio con baño dorado" },
    { label: "Durabilidad", value: "+10.000 ciclos de conexión" },
  ],
  features: [
    "Carga un iPhone 16 de 0% a 60% en 30 minutos",
    "Función 2 en 1: carga rápida y transferencia de datos simultánea",
    "Resistencia de 56KΩ integrada para protección contra sobrecorriente",
    "Compatible con carga adaptativa AFC",
    "Nylon trenzado flexible y resistente a enredos",
    "Compatible con iPhone 17/16/15, Galaxy S25/S24/S23, iPad Pro, MacBook, Pixel, XPS y más"
  ]
},
{
  id: 5,
  name: "Cable UGREEN USB-C a Lightning MFi Certificado Trenzado 1M",
  price: 70000,
  category: "Cables",
  image: "/cable_lighting.png", // reemplaza con el nombre real
  description: "Cable USB-C a Lightning MFi certificado, nylon trenzado, carga rápida PD hasta 87W y transferencia de datos a 480 Mbps. 1 metro, color negro.",
  fullDescription: "El cable UGREEN USB-C a Lightning cuenta con certificación MFi oficial de Apple, usando el conector C94 Lightning original y chip MFi verificado, lo que garantiza compatibilidad total y protección real para la batería de tu iPhone o iPad. Compatible con cargadores PD desde 18W hasta 87W para carga rápida en toda la línea iPhone 11, 12, 13 y 14, así como iPad Pro y iPad Air. Su construcción de nylon trenzado 21AWG, carcasa de aluminio y conectores resistentes a la corrosión están diseñados para superar los 15.000 dobleces sin degradarse, muy por encima del estándar del mercado.",
  specs: [
    { label: "Conectores", value: "USB-C a Lightning (8-PIN)" },
    { label: "Certificación", value: "MFi oficial de Apple (chip C94 original)" },
    { label: "Carga rápida", value: "Compatible con cargadores PD 18W, 29W, 30W, 61W, 65W y 87W" },
    { label: "Transferencia de datos", value: "Hasta 480 Mbps" },
    { label: "Calibre del cable", value: "21AWG (menor resistencia interna)" },
    { label: "Material exterior", value: "Nylon trenzado" },
    { label: "Carcasa", value: "Aleación de aluminio resistente a la corrosión" },
    { label: "Durabilidad", value: "+15.000 dobleces" },
    { label: "Longitud", value: "1 metro" },
    { label: "Color", value: "Negro" }
  ],
  features: [
    "Certificación MFi oficial: chip C94 original, sin riesgo de daño a la batería del iPhone",
    "Carga rápida PD compatible con cargadores de 18W hasta 87W",
    "Transferencia de datos hasta 480 Mbps entre iPhone/iPad y Mac",
    "21AWG: menor resistencia interna para carga más rápida y estable",
    "Supera los 15.000 dobleces — más duradero que cables estándar del mercado",
    "Compatible con iPhone 6 al 14 Pro Max, iPad (todas las generaciones), AirPods y iPod"
  ]
},
{
  id: 6,
  name: "Cable UGREEN UNO USB-C a USB-C 100W con Pantalla LED",
  price: 50000,
  category: "Cables",
  image: "/cable100W.png",
  description: "Cable USB-C trenzado de 100W con pantalla LED con expresión facial. Potencia máxima para laptops, tablets y smartphones de alta demanda.",
  fullDescription: "La versión de 100W del cable UGREEN UNO lleva la carga rápida al siguiente nivel. Con soporte para Power Delivery 3.0 y PPS hasta 100W (20V/5A), carga un MacBook Pro del 0% al 43% en solo 30 minutos, y un iPhone 17 del 0% al 60% en el mismo tiempo. Su pantalla LED con expresión facial no solo muestra el estado de carga, sino que le da un toque de personalidad a tu escritorio. El chip E-Marker integrado ajusta automáticamente el voltaje y la corriente según el dispositivo conectado, protegiendo tu equipo en todo momento. Construido con nylon trenzado y carcasa de aluminio para resistir más de 10.000 dobleces.",
  specs: [
    { label: "Potencia máxima", value: "100W (20V/5A)" },
    { label: "Protocolo de carga", value: "USB Power Delivery 3.0, PPS, Quick Charge 4.0, AFC" },
    { label: "Chip", value: "E-Marker integrado (ajuste automático de voltaje y corriente)" },
    { label: "Transferencia de datos", value: "Hasta 480 Mbps" },
    { label: "Indicador LED", value: "Pantalla con expresión facial animada" },
    { label: "Conectores", value: "USB-C a USB-C" },
    { label: "Material exterior", value: "Nylon trenzado" },
    { label: "Carcasa", value: "Aleación de aluminio" },
    { label: "Durabilidad", value: "+10.000 dobleces" },
  ],
  features: [
    "100W de potencia: carga MacBook Pro al 43% y iPhone 17 al 60% en 30 minutos",
    "Pantalla LED con expresión facial animada — un toque de personalidad en tu escritorio",
    "Chip E-Marker: ajuste automático de voltaje y corriente según el dispositivo",
    "Función 2 en 1: carga rápida y transferencia de datos hasta 480 Mbps",
    "Nylon trenzado flexible y resistente a enredos",
    "Compatible con MacBook Pro/Air, iPad Pro 2024, iPhone Air 17/16/15, Galaxy S25/S24/S23, Pixel 10/9/8 y más"
  ]
},
  
{
  id: 7,
  name: "Mouse Vertical Ergonómico UGREEN Inalámbrico 2.4GHz 4000 DPI",
  price: 80000,
  category: "Periféricos",
  image: "/mouse_ergo.png", // reemplaza con el nombre real
  description: "Mouse vertical ergonómico inalámbrico 2.4GHz con 6 botones silenciosos, DPI ajustable hasta 4000 y compatibilidad con Windows, Mac, Linux, Android y Chrome OS.",
  fullDescription: "El Mouse Vertical Ergonómico UGREEN adopta un diseño que imita la posición natural de la mano, reduciendo la tensión en la muñeca y el antebrazo durante largas jornadas de trabajo. Con conexión inalámbrica estable a 2.4GHz y alcance de hasta 10 metros, ofrece libertad de movimiento sin cables. Sus 4 niveles de DPI ajustables (1000/1600/2000/4000) permiten adaptarlo a cualquier tarea, desde trabajo de precisión hasta uso general. Los 6 botones silenciosos y las patas de teflón garantizan una experiencia fluida y discreta, ideal para oficinas y espacios compartidos. Compatible con Windows, macOS, Linux, Android y Chrome OS, con un switch físico en la base para cambiar entre modos WIN/MAC.",
  specs: [
    { label: "Conectividad", value: "Inalámbrico 2.4GHz con receptor USB" },
    { label: "Alcance", value: "Hasta 10 metros" },
    { label: "DPI", value: "1000 / 1600 / 2000 / 4000 (ajustable)" },
    { label: "Botones", value: "6 botones con click silencioso" },
    { label: "Sensor", value: "Óptico" },
    { label: "Alimentación", value: "1 pila AA (no incluida)" },
    { label: "Patas", value: "Teflón para deslizamiento suave" },
    { label: "Tamaño de mano recomendado", value: "Mediana a grande (17.5 cm en adelante)" },
    { label: "Color", value: "Negro" },
    { label: "Compatibilidad", value: "Windows 7/8.1/10/11, macOS 10.15+, Linux, Chrome OS, Android 5.0+, iPadOS" }
  ],
  features: [
    "Diseño vertical ergonómico: reduce fatiga y tensión en muñeca y antebrazo",
    "4 niveles de DPI ajustables (hasta 4000) para cualquier tipo de tarea",
    "6 botones silenciosos — ideal para oficinas, bibliotecas y espacios compartidos",
    "Patas de teflón para deslizamiento suave y silencioso",
    "Switch WIN/MAC en la base para cambiar de sistema sin reconfigurar",
    "Modo de suspensión automático tras 10 minutos de inactividad para ahorrar batería",
    "Botones laterales de avance/retroceso para mayor productividad",
    "Indicador de batería baja con luz roja parpadeante"
  ]
},
]

export const categories = [...new Set(products.map((p) => p.category))]

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id)
}
