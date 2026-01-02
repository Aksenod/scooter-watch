/**
 * Recording Feature Constants
 */

export const RECORDING_CONSTANTS = {
  // Типы медиа
  MEDIA_TYPES: {
    PHOTO: 'photo',
    VIDEO: 'video',
  } as const,

  // Настройки камеры
  CAMERA: {
    FACING_MODE: 'environment', // Задняя камера
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  },

  // Настройки видео
  VIDEO: {
    MAX_DURATION: 30, // секунд
    MIME_TYPE: 'video/webm',
  },

  // Настройки фото
  PHOTO: {
    MIME_TYPE: 'image/jpeg',
    QUALITY: 0.8,
  },

  // Сообщения
  MESSAGES: {
    UPLOAD_SUCCESS: 'Файл успешно загружен',
    UPLOAD_ERROR: 'Ошибка загрузки файла',
    FILE_TOO_LARGE: 'Файл слишком большой',
    CAMERA_ERROR: 'Не удалось получить доступ к камере',
  } as const,
} as const
