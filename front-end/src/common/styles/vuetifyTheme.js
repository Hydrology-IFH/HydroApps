const getCSSVar = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}
// vuetify theme for HydroApps
export const vuetifyTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': getCSSVar('--uni-sand-0'),
    'surface-variant': getCSSVar('--uni-blue'),
    'on-surface-variant': getCSSVar('--uni-sand'),
    primary: getCSSVar('--bs-primary'),
    'primary-darken-1': getCSSVar('--uni-blue-dark'),
    secondary: getCSSVar('--uni-green-60'),
    'secondary-darken-1': getCSSVar('--uni-green-100'),
    error: getCSSVar('--bs-danger'),
    info: getCSSVar('--bs-info'),
    success: getCSSVar('--bs-success'),
    warning: getCSSVar('--bs-warning')
  }
}
window.vuetifyTheme = vuetifyTheme