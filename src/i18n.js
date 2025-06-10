import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      es: {
        translation: {
          menu: {
            inicio: "Inicio",
            educacion: "Educación",
            sintomas: "Síntomas",
            consultas: "Teleconsultas",
            doctores: "Doctores",
            presion: "Presión Arterial",
            estadisticas: "Mis Estadísticas",
            chat: "Consultas",
            alertas: "Alertas",
            notificacion: "Notificación",
            estado: "Estado",
            pacientes: "Pacientes",
            riesgo: "Alertas de Riesgo",
            cerrarSesion: "Cerrar Sesión",
            idioma: "Idioma",
            español: "Español",
            japones: "Japonés",
            ingles: "Inglés",
            menu: "Menú"
          }
        }
      },
      en: {
        translation: {
          menu: {
            inicio: "Home",
            educacion: "Education",
            sintomas: "Symptoms",
            consultas: "Teleconsultations",
            doctores: "Doctors",
            presion: "Blood Pressure",
            estadisticas: "My Statistics",
            chat: "Consultations",
            alertas: "Alerts",
            notificacion: "Notification",
            estado: "Status",
            pacientes: "Patients",
            riesgo: "Risk Alerts",
            cerrarSesion: "Log Out",
            idioma: "Language",
            español: "Spanish",
            japones: "Japanese",
            ingles: "English",
            menu: "Menu"
          }
        }
      },
      ja: {
        translation: {
          menu: {
            inicio: "ホーム",
            educacion: "教育",
            sintomas: "症状",
            consultas: "オンライン診療",
            doctores: "医師",
            presion: "血圧",
            estadisticas: "統計",
            chat: "相談",
            alertas: "アラート",
            notificacion: "通知",
            estado: "状態",
            pacientes: "患者",
            riesgo: "リスク警告",
            cerrarSesion: "ログアウト",
            idioma: "言語",
            español: "スペイン語",
            japones: "日本語",
            ingles: "英語",
            menu: "メニュー"
          }
        }
      }
    }
  });

export default i18n;
