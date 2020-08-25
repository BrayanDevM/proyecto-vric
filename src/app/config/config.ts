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
    ]
  }
};
