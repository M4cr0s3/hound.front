<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div class="relative">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              :class="column.headerClass"
          >
            {{ column.title }}
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr
            v-for="(row, rowIndex) in data"
            :key="rowKey ? row[rowKey] : rowIndex"
            class="hover:bg-gray-50"
            :class="{ 'cursor-pointer': rowClickable, [rowClass]: rowClass }"
            @click="handleRowClick(row)"
        >
          <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4"
              :class="column.cellClass"
          >
            <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
            >
              {{ formatCellValue(row, column) }}
            </slot>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <Pagination
        v-if="pagination"
        :pagination="pagination"
        :is-loading="props.isLoading"
        @page-change="$emit('page-change', $event)"
        class="border-t border-gray-200"
        :text="paginationText"
    />
  </div>
</template>

<script setup lang="ts">
import {Pagination} from './';
import {type Pagination as PaginationType} from '@/api';

interface Column {
  key: string;
  title: string;
  format?: (value: any) => string;
  headerClass?: string;
  cellClass?: string;
}

interface Props {
  columns: Column[];
  data: any[];
  rowKey?: string;
  pagination?: PaginationType;
  rowClickable?: boolean;
  isLoading?: boolean;
  rowClass?: string
  paginationText: string
}

const props = withDefaults(defineProps<Props>(), {
  rowClickable: false,
});

const emit = defineEmits<{
  (e: 'row-click', row: any): void;
  (e: 'page-change', url: string | null): void;
}>();

const formatCellValue = (row: any, column: Column) => {
  const value = row[column.key];
  return column.format ? column.format(value) : value;
};

const handleRowClick = (row: any) => {
  if (props.rowClickable) {
    emit('row-click', row);
  }
};
</script>
