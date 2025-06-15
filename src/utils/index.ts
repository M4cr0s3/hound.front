import { PLATFORMS } from "@/data";
import type { IconifyIcon } from "@iconify/vue";

/**
 * Форматирует дату в локальное строковое представление
 * @param date Дата в формате строки или объекта Date
 * @param options Настройки форматирования
 * @returns Отформатированная строка с датой и временем
 */
export function formatDateTime(
    date: string | Date,
    options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', options).format(dateObj);
}

/**
 * Форматирует дату в относительное время (например, "2 часа назад")
 * @param date Дата в формате строки или объекта Date
 * @returns Строка с относительным временем
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);

  const intervals: { [key: string]: { seconds: number, forms: [string, string, string] } } = {
    year: { seconds: 31536000, forms: ['год', 'года', 'лет'] },
    month: { seconds: 2592000, forms: ['месяц', 'месяца', 'месяцев'] },
    week: { seconds: 604800, forms: ['неделя', 'недели', 'недель'] },
    day: { seconds: 86400, forms: ['день', 'дня', 'дней'] },
    hour: { seconds: 3600, forms: ['час', 'часа', 'часов'] },
    minute: { seconds: 60, forms: ['минута', 'минуты', 'минут'] },
    second: { seconds: 1, forms: ['секунда', 'секунды', 'секунд'] },
  };

  function pluralize(number: number, forms: [string, string, string]): string {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  }

  for (const key in intervals) {
    const { seconds: unitSeconds, forms } = intervals[key];
    const interval = Math.floor(seconds / unitSeconds);
    if (interval >= 1) {
      const unit = pluralize(interval, forms);
      return `${interval} ${unit} назад`;
    }
  }

  return 'только что';
}

/**
 * Рекурсивно очищает реактивную форму, сохраняя структуру.
 * @param form - Реактивный объект формы.
 * @param initialForm - Опционально: начальное состояние формы (для сброса к дефолтным значениям).
 */
export function resetForm(form: Record<string, any>, initialForm?: Record<string, any>) {
  for (const key in form) {
    if (initialForm && key in initialForm) {
      form[key] = structuredClone(initialForm[key]);
    } else {
      if (Array.isArray(form[key])) {
        form[key] = [];
      } else if (typeof form[key] === 'object' && form[key] !== null) {
        resetForm(form[key]);
      } else if (typeof form[key] === 'number') {
        form[key] = 0;
      } else if (typeof form[key] === 'boolean') {
        form[key] = false;
      } else {
        form[key] = '';
      }
    }
  }
}

export function getReadableIssueStatus(status: string): string {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export function getIssueStatusColor(status: string): Variant {
  switch (status) {
    case 'in_progress':
      return 'info';
    case 'resolved':
      return 'success';
    case 'closed':
      return 'danger';
    default:
      return 'warning';
  }
}

type Level = 'error' | 'warning' | 'info' | 'debug' | string;
type Variant = 'danger' | 'warning' | 'info' | 'success' | 'default';

export function getLevelColor(level: Level): string {
  const colors: Record<string, string> = {
    error: 'red',
    warning: 'yellow',
    info: 'blue',
    debug: 'gray',
    fatal: 'red',
    critical: 'red',
  };

  return colors[level.toLowerCase()] || 'gray';
}

export function getLevelIcon(level: Level): string | IconifyIcon {
  const icons: Record<string, string> = {
    error: 'mdi:alert-circle',
    warning: 'mdi:alert',
    info: 'mdi:information',
    debug: 'mdi:bug',
    fatal: 'mdi:skull',
    critical: 'mdi:alert-octagon',
  };

  return icons[level.toLowerCase()] || 'mdi:help-circle';
}

export function getLevelVariant(level: Level): Variant {
  const variants: Record<string, Variant> = {
    error: 'danger',
    warning: 'warning',
    info: 'info',
    fatal: 'danger',
    critical: 'danger',
  };

  return variants[level.toLowerCase()] || 'default';
}

export function getLevelName(level: Level): string {
  const names: Record<string, string> = {
    error: 'Error',
    warning: 'Warning',
    info: 'Information',
    debug: 'Debug',
    fatal: 'Fatal',
    critical: 'Critical',
  };

  return names[level.toLowerCase()] || level;
}

export const getProjectIcon = (platform: string): string => {
  return PLATFORMS.find(p => p.name === platform)?.icon ?? '';
};