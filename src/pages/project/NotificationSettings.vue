<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Настройки нотификации</h1>
    </div>
    <form
        class="space-y-6"
        @submit.prevent="handleSubmit"
    >
      <SelectField
          description="Выберите тип события, на которое будет отправляться уведомления"
          label="Тип события"
          v-model="form.event_type"
          :error="errors?.event_type?.toString()"
          :options="['error', 'warning', 'info']"
      />
      <SelectField
          description="Выберите тип триггера, когда уведомление должно срабатывать. Например, когда переходит определенное количество за какое-либо временное окно"
          label="Тип уведомления"
          option-label="label"
          option-value="value"
          v-model="form.trigger_type"
          :error="errors?.trigger_type?.toString()"
          :options="[
					{
						value: 'count',
						label: 'Количество',
					},
					{
						value: 'rate_limit',
						label: 'Превышение лимита',
					},
				]"
      />

      <InputField
          id="trigger-params-threshold"
          label="Порог"
          placeholder="10"
          name="trigger_params[threshold]"
          type="number"
          v-model="form.trigger_params.threshold"
          :error="errors?.trigger_params?.threshold"
      />
      <InputField
          id="trigger-params-time-window"
          label="Временное окно"
          name="trigger_params[time_window]"
          type="number"
          v-model="form.trigger_params.time_window"
          :error="errors?.trigger_params?.time_window"
      />

      <Checkbox
          v-for="channel in CHANNELS"
          :id="channel.value"
          v-model="form.channels"
          :value="channel.value"
          name="channels[]"
          :key="channel.value"
          :label="channel.label"
      />

      <div v-if="errors?.channels" class="text-red-500 text-sm mt-1">
        {{ errors?.channels?.toString() }}
      </div>

      <div class="mt-6">
        <SubmitButton :loading="isLoading" class="cursor-pointer">Добавить</SubmitButton>
      </div>
    </form>

    <div class="bg-white rounded-lg border border-gray-200 mt-4">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">
          Правила нотификации
        </h2>
      </div>

      <LoadingState v-if="isLoadingRules"/>
      <EmptyState
          v-else-if="!rules.length"
          icon="heroicons:bell"
          title="Нет правил нотификации"
          description="В данный момент никаких правил нотификации не создано."
      />

      <ul v-else class="divide-y divide-gray-200">
        <NotificationRuleCard
            v-for="rule in rules"
            :key="rule.id"
            :rule="rule"
            @updated="() => NotificationRulesApi.getByProject(slug)"
            @deleted="handleDelete"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef } from 'vue';
import { type Id, type NotificationRule, type NotificationRuleForm, NotificationRulesApi } from '../../api';
import { EmptyState, LoadingState, NotificationRuleCard } from "../../components/projects/settings/notification";
import {
  Checkbox,
  InputField,
  SelectField,
  SubmitButton,
} from '../../components/ui';
import { resetForm } from "../../utils";

const {slug} = defineProps<{
  slug: string;
}>();

const CHANNELS = [
  {
    value: 'email',
    label: 'Email',
  },
  {
    value: 'telegram',
    label: 'Telegram',
  },
];

const isLoading = ref(false);
const isLoadingRules = ref(false);
const rules = ref<NotificationRule[]>([])
const errors = shallowRef({ 
  event_type: '',
  trigger_type: '',
  trigger_params: {
    threshold: 10,
    time_window: 60,
  },
  channels: [],
});
const form = reactive<NotificationRuleForm>({
  event_type: 'warning',
  trigger_type: 'count',
  trigger_params: {
    threshold: 10,
    time_window: 60,
  },
  channels: [],
});

async function handleSubmit() {
  try {
    isLoading.value = true;
    await NotificationRulesApi.create(slug, form);
    rules.value = await NotificationRulesApi.getByProject(slug);
    resetForm(form);
  } catch (err: any) {
    errors.value = err.data.errors;
  } finally {
    isLoading.value = false;
  }
}

async function handleDelete(id: Id) {
  try {
    isLoadingRules.value = true;
    await NotificationRulesApi.delete(id);
    rules.value = await NotificationRulesApi.getByProject(slug);
  } catch (err: any) {
    errors.value = err.data.errors;
  } finally {
    isLoadingRules.value = false
  }
}

onMounted(async () => {
  isLoadingRules.value = true;
  rules.value = await NotificationRulesApi.getByProject(slug);
  isLoadingRules.value = false;
})
</script>

<style scoped></style>
