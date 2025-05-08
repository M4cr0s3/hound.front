import { computed } from 'vue';
import { formatDateTime } from '@/utils';

export const columns = computed(() => [
	{
		key: 'message',
		title: 'Событие',
		cellClass: 'whitespace-nowrap text-sm text-gray-500',
	},
	{
		key: 'type',
		title: 'Тип',
	},
	{
		key: 'level',
		title: 'Уровень',
	},
	{
		key: 'count',
		title: 'Количество',
		cellClass: 'whitespace-nowrap text-sm text-gray-500',
		format: (value: number) => value.toLocaleString(),
	},
	{
		key: 'created_at',
		title: 'Последнее',
		cellClass: 'whitespace-nowrap text-sm text-gray-500',
		format: (value: string) => formatDateTime(value),
	},
	{
		key: 'actions',
		title: 'Действия',
		cellClass: 'text-right',
	},
]);
