export const Config = {
  REST: {
    PRINCIPAL: {
      // URL: 'https://p-vric.herokuapp.com'
      URL: 'http://localhost:8080'
    },
    OTRAS: {
      REST_COUNTRIES: 'https://restcountries.eu/rest/v2/'
    }
  },
  SELECTS: {
    regionalesICBF: [
      { value: 'Cauca', label: 'Cauca' },
      { value: 'Valle del Cauca', label: 'Valle del Cauca' }
    ],
    centrosZonales: [
      { value: 'Buenaventura', label: 'Buenaventura' },
      { value: 'Buga', label: 'Buga' },
      { value: 'Cartago', label: 'Cartago' },
      { value: 'Centro', label: 'Centro' },
      { value: 'Jamundí', label: 'Jamundí' },
      { value: 'Ladera', label: 'Ladera' },
      { value: 'Nororiental', label: 'Nororiental' },
      { value: 'Palmira', label: 'Palmira' },
      { value: 'Restaurar', label: 'Restaurar' },
      { value: 'Roldanillo', label: 'Roldanillo' },
      { value: 'Sevilla', label: 'Sevilla' },
      { value: 'Sur', label: 'Sur' },
      { value: 'Suroriental', label: 'Suroriental' },
      { value: 'Tulua', label: 'Tulua' },
      { value: 'Yumbo', label: 'Yumbo' }
    ],
    estados: [
      { value: true, label: 'Activo' },
      { value: false, label: 'Inactivo' }
    ],
    estadosBeneficiarios: [
      {
        value: 'Pendiente vincular',
        label: 'Pendiente vincular',
        iconColor: 'text-primary'
      },
      {
        value: 'Pendiente desvincular',
        label: 'Pendiente desvincular',
        iconColor: 'text-warning'
      },
      {
        value: 'Dato sensible',
        label: 'Dato sensible',
        iconColor: 'text-info'
      },
      {
        value: 'Concurrencia',
        label: 'Concurrencia',
        iconColor: 'text-danger'
      },
      {
        value: 'Vinculado',
        label: 'Vinculado',
        iconColor: 'text-success'
      },
      {
        value: 'Desvinculado',
        label: 'Desvinculado',
        iconColor: 'text-secondary'
      }
    ],
    tiposDeDocumento: [
      {
        pais: 'Colombianas/os',
        documentos: [
          { value: 'RC', label: 'Registro civil', icon: 'fa-id-card' },
          { value: 'TI', label: 'Tarjeta de Identidad', icon: 'fa-id-card' },
          { value: 'CC', label: 'Cédula de Ciudadanía', icon: 'fa-id-card' }
        ]
      },
      {
        pais: 'Extranjeras/os',
        documentos: [
          {
            value: 'PEP',
            label: 'Permiso Especial de Permanencia',
            icon: 'fa-user-clock'
          },
          { value: 'SD', label: 'Sin Documento', icon: 'fa-question-square' }
        ]
      }
    ],
    sexos: [
      {
        value: 'Mujer',
        label: 'Mujer',
        icon: 'fa-venus'
      },
      {
        value: 'Hombre',
        label: 'Hombre',
        icon: 'fa-mars'
      },
      {
        value: 'Otro',
        label: 'Otro',
        icon: 'fa-venus-mars'
      }
    ],
    paises: [
      { value: 'Colombia', label: 'Colombia' },
      { value: 'Argentina', label: 'Argentina' },
      { value: 'Chile', label: 'Chile' },
      { value: 'Ecuador', label: 'Ecuador' },
      { value: 'México', label: 'México' },
      { value: 'Panamá', label: 'Panamá' },
      { value: 'Perú', label: 'Perú' },
      { value: 'Puerto rico', label: 'Puerto rico' },
      { value: 'Venezuela', label: 'Venezuela' }
    ],
    autorreconocimientos: [
      { value: 'Afrocolombiano', label: 'Afrocolombiano' },
      { value: 'Comunidad negra', label: 'Comunidad negra' },
      { value: 'Indigena', label: 'Indigena' },
      { value: 'Palenquero', label: 'Palenquero' },
      { value: 'RROM/Gitano', label: 'RROM/Gitano' },
      {
        value: 'Raizal archipielago San Andrés',
        label: 'Raizal archipielago San Andrés'
      },
      { value: 'Ninguno', label: 'Ninguno' }
    ],
    discapacidades: [
      { value: true, label: 'Si' },
      { value: false, label: 'No' }
    ],
    criteriosDeAtencion: [
      { value: 'Sisbén', label: 'Puntaje de sisbén' },
      { value: 'Carta de vulnerabilidad', label: 'Carta de vulnerabilidad' },
      { value: 'Otro', label: 'Otro' }
    ],
    tiposDeAcudientes: [
      { value: 'Madre', label: 'Madre' },
      { value: 'Padre', label: 'Padre' },
      { value: 'Tia/o', label: 'Tia/o' },
      { value: 'Abuela/o', label: 'Abuela/o' },
      { value: 'Conyugue', label: 'Conyugue' },
      { value: 'Si misma', label: 'Si misma' },
      { value: 'Otro', label: 'Otro' }
    ]
  }
};
