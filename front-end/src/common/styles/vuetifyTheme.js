import { get } from "ol/proj";

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
    'surface-variant': '#424242',
    'on-surface-variant': getCSSVar('--uni-sand'),
    primary: getCSSVar('--bs-primary'),
    'primary-darken-1': getCSSVar('--uni-blue-dark'),
    secondary: getCSSVar('--uni-sand'),
    'secondary-darken-1': getCSSVar('--uni-brown'),
    error: getCSSVar('--bs-danger'),
    info: getCSSVar('--bs-info'),
    success: getCSSVar('--bs-success'),
    warning: getCSSVar('--bs-warning')
  }
}