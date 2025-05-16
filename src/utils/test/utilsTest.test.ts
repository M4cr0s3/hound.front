import { describe, expect, test } from 'vitest';
import { formatDateTime, formatRelativeTime } from '..';

describe('Проверка utils', () => {
test('formatDateTime форматирует данные', async () => {
  expect(formatDateTime('2025-05-16T00:00:00Z')).toBe('16 мая 2025 г., 03:00:00')
})
  describe('formatRelativeTime форматирует данные', () => {
    test('Правильные(3 часа назад)', async () => {
      const currentDate = new Date().getTime();
      const formatDate = new Date(currentDate - (3 * 60 * 60 * 1000)) 
      expect(formatRelativeTime(formatDate)).toBe('3 hours назад')
    })
    test('Текущие', async () => {
      const currentDate = new Date().toISOString()
      expect(formatRelativeTime(currentDate)).toBe('только что')
    })
    test('Неправильные(3 часа вперед)', async () => {
      const currentDate = new Date().getTime();
      const formatDate = new Date(currentDate + (3 * 60 * 60 * 1000)) 
      expect(formatRelativeTime(formatDate)).toBe('только что')
    })
  })
})
