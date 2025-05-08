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
  return new Intl.DateTimeFormat('default', options).format(dateObj);
}

/**
 * Форматирует дату в относительное время (например, "2 часа назад")
 * @param date Дата в формате строки или объекта Date
 * @returns Строка с относительным временем
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
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