<template>
  <div class="relative">
    <div class="flex items-center">
      <input
          type="text"
          :value="displayValue"
          @click="toggleCalendar"
          readonly
          class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          :placeholder="placeholder"
      />
      <button
          type="button"
          @click="toggleCalendar"
          class="absolute right-0 px-3 py-2 text-gray-400 hover:text-gray-500"
      >
        <Icon icon="mdi:calendar" class="h-5 w-5"/>
      </button>
    </div>

    <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
    >
      <div
          v-if="isOpen"
          class="absolute z-10 mt-1 w-auto bg-white rounded-md shadow-lg p-4 border border-gray-200 min-w-60"
      >
        <div class="flex justify-between items-center mb-4">
          <button
              @click="prevMonth"
              type="button"
              class="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Icon icon="mdi:chevron-left" class="h-5 w-5"/>
          </button>
          <span class="text-sm font-medium text-gray-900">
            {{ currentMonthName }} {{ currentYear }}
          </span>
          <button
              @click="nextMonth"
              type="button"
              class="p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <Icon icon="mdi:chevron-right" class="h-5 w-5"/>
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 mb-2">
          <div
              v-for="day in ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']"
              :key="day"
              class="text-xs text-center text-gray-500"
          >
            {{ day }}
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <div
              v-for="day in daysInMonth"
              :key="day.day"
              @click="selectDate(day)"
              class="text-center py-1 text-sm rounded-full"
              :class="{
              'text-gray-400': !day.isCurrentMonth,
              'hover:bg-gray-100 cursor-pointer': day.isCurrentMonth,
              'bg-indigo-100 text-indigo-700 font-medium': day.isSelected,
              'bg-indigo-600 text-white font-medium': day.isToday && day.isSelected
            }"
          >
            {{ day.day }}
          </div>
        </div>

        <div class="mt-4 flex justify-between">
          <button
              @click="selectToday"
              type="button"
              class="text-xs text-indigo-600 cursor-pointer hover:text-indigo-900"
          >
            Сегодня
          </button>
          <button
              @click="clearDate"
              type="button"
              class="text-xs text-gray-500 cursor-pointer hover:text-gray-700"
          >
            Очистить
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  modelValue: string | null,
  placeholder?: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
}>();

const isOpen = ref(false);
const currentDate = ref(new Date());
const selectedDate = ref<Date | null>(null);

if (props.modelValue) {
  selectedDate.value = new Date(props.modelValue);
}

const formatDateForDisplay = (date: Date | null): string => {
  if (!date) return '';

  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};


const displayValue = computed(() => {
  return formatDateForDisplay(selectedDate.value);
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const currentMonth = computed(() => {
  return currentDate.value.getMonth();
});

const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', {month: 'long'});
});

const daysInMonth = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const prevMonthDays = firstDay.getDay();

  const nextMonthDays = 6 - lastDay.getDay();

  const days = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    days.push({
      day,
      date: new Date(year, month - 1, day),
      isCurrentMonth: false,
      isToday: isToday(new Date(year, month - 1, day)),
      isSelected: isSelected(new Date(year, month - 1, day))
    });
  }

  const totalDays = lastDay.getDate();
  for (let i = 1; i <= totalDays; i++) {
    const date = new Date(year, month, i);
    days.push({
      day: i,
      date,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: isSelected(date)
    });
  }

  for (let i = 1; i <= nextMonthDays; i++) {
    days.push({
      day: i,
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      isToday: isToday(new Date(year, month + 1, i)),
      isSelected: isSelected(new Date(year, month + 1, i))
    });
  }

  return days;
});

const isToday = (date: Date) => {
  const today = new Date();
  return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  );
};

const isSelected = (date: Date) => {
  if (!selectedDate.value) return false;
  return (
      date.getDate() === selectedDate.value.getDate() &&
      date.getMonth() === selectedDate.value.getMonth() &&
      date.getFullYear() === selectedDate.value.getFullYear()
  );
};

const toggleCalendar = () => {
  isOpen.value = !isOpen.value;
};

const prevMonth = () => {
  currentDate.value = new Date(
      currentYear.value,
      currentMonth.value - 1,
      1
  );
};

const nextMonth = () => {
  currentDate.value = new Date(
      currentYear.value,
      currentMonth.value + 1,
      1
  );
};

const selectDate = (day: any) => {
  if (!day.isCurrentMonth) return;

  selectedDate.value = day.date;
  currentDate.value = new Date(day.date);
  const outputDate = formatDateForOutput(day.date);
  emit('update:modelValue', outputDate);
  emit('change', outputDate);
  isOpen.value = false;
};

const selectToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectedDate.value = today;
  currentDate.value = new Date(today);
  const outputDate = formatDateForOutput(today);
  emit('update:modelValue', outputDate);
  emit('change', outputDate);
  isOpen.value = false;
};

const formatDateForOutput = (date: Date | null): string | null => {
  if (!date) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const clearDate = () => {
  selectedDate.value = null;
  emit('update:modelValue', null);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isOpen.value = false;
  }
};

const parseDateFromApi = (dateString: string | null): Date | null => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return null;
    }

    return date;
  } catch (e) {
    console.error('Error parsing date:', e);
    return null;
  }
};

onMounted(() => {
  if (props.modelValue) {
    selectedDate.value = parseDateFromApi(props.modelValue);
    if (selectedDate.value) {
      currentDate.value = new Date(selectedDate.value);
    }
  }
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

watch(() => props.modelValue, (newValue) => {
  const newDate = parseDateFromApi(newValue);

  if (newDate) {
    const newDateNormalized = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
    const currentDateNormalized = selectedDate.value
        ? new Date(selectedDate.value.getFullYear(), selectedDate.value.getMonth(), selectedDate.value.getDate())
        : null;

    if (!currentDateNormalized || newDateNormalized.getTime() !== currentDateNormalized.getTime()) {
      selectedDate.value = newDate;
      currentDate.value = new Date(newDate);
    }
  } else {
    selectedDate.value = null;
  }
}, {immediate: true});
</script>