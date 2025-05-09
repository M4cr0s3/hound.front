import { computed } from 'vue';
import { formatDateTime } from '@/utils';
import type {Column} from "@/components/ui/DataTable.vue";

export const columns = computed<Column[]>(() => [
	{
		key: 'message',
		title: 'Событие',
		cellClass: 'whitespace-nowrap text-sm text-gray-500',
		maxWidth: '200px'
	},
	{
		key: 'type',
		title: 'Тип',
		maxWidth: '200px',
		truncate: true
	},
	{
		key: 'level',
		title: 'Уровень',
		maxWidth: '80px'
	},
	{
		key: 'count',
		title: 'Количество',
		cellClass: 'whitespace-nowrap text-sm text-gray-500',
		format: (value: number) => value.toLocaleString(),
		maxWidth: '80px'
	},
	{
		key: 'created_at',
		title: 'Последнее',
		cellClass: 'whitespace-nowrap text-sm text-gray-500',
		format: (value: string) => formatDateTime(value),
		maxWidth: '80px',
	},
	{
		key: 'actions',
		title: 'Действия',
		cellClass: 'text-right',
	},
]);

export const actions = [
	{key: 'create-issue', label: 'Создать задачу', icon: 'heroicons:plus-circle'},
	{key: 'delete', label: 'Удалить', icon: 'heroicons:trash', variant: 'danger'}
];