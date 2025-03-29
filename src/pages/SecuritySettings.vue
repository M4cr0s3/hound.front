<template>
  <div>
    <div class="px-6 py-5">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Конфиденциальность и безопасность</h3>
    </div>

    <div class="px-6 py-5 space-y-6">
      <ToggleField
          id="store-ip-addresses"
          v-model="securityOptions.storeIpAddresses"
          label="Хранить IP-адреса"
          description="Выключите этот параметр, если вы не хотите хранить IP-адреса в базе данных."
      />

      <InputField
          id="allowed-domains"
          label="Разрешенные доменные имена"
          v-model="securityOptions.allowedDomains"
          type="textarea"
          description="Список доменных имен, разделенных переносом строки, с которых разрешено отправлять запросы ."
          placeholder="example.com\n*.example.com"
      />

      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-700">Ограничение запросов</h4>
        <RadioGroup v-model="securityOptions.rateLimiting" class="space-y-3">
          <RadioGroupOption value="none" v-slot="{ checked }">
            <div class="flex items-start cursor-pointer">
              <div class="flex items-center h-5 mt-0.5">
                <div class="relative flex items-center justify-center h-4 w-4 border rounded-full"
                     :class="checked ? 'border-indigo-500' : 'border-gray-300'">
                  <div v-if="checked" class="absolute h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Без лимита</label>
                <p class="text-gray-500">Неограниченное количество событий</p>
              </div>
            </div>
          </RadioGroupOption>

          <RadioGroupOption value="default" v-slot="{ checked }">
            <div class="flex items-start cursor-pointer">
              <div class="flex items-center h-5 mt-0.5">
                <div class="relative flex items-center justify-center h-4 w-4 border rounded-full"
                     :class="checked ? 'border-indigo-500' : 'border-gray-300'">
                  <div v-if="checked" class="absolute h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
              </div>
              <div class="ml-3 text-sm">
                <label class="font-medium text-gray-700">Стандартный (100 событий/минуту)</label>
                <p class="text-gray-500">Рекомендуемый лимит для большинства проектов</p>
              </div>
            </div>
          </RadioGroupOption>

          <RadioGroupOption value="custom" v-slot="{ checked }">
            <div class="flex items-center cursor-pointer">
              <div class="flex items-center h-5 mt-0.5">
                <div class="relative flex items-center justify-center h-4 w-4 border rounded-full"
                     :class="checked ? 'border-indigo-500' : 'border-gray-300'">
                  <div v-if="checked" class="absolute h-2 w-2 rounded-full bg-indigo-600"></div>
                </div>
              </div>
              <div class="ml-3 text-sm flex-1">
                <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label class="font-medium text-gray-700">Кастомный лимит:</label>
                  <div class="flex items-center space-x-2">
                    <InputField
                        id="custom-rate-limit"
                        v-model="securityOptions.customRateLimit"
                        type="number"
                        class="w-20"
                        :disabled="!checked"
                        min="1"
                    />
                    <span class="text-gray-500 whitespace-nowrap">событий в минуту</span>
                  </div>
                </div>
                <p v-if="checked && securityOptions.customRateLimit > 1000" class="mt-1 text-yellow-600 text-xs">
                  Высокий лимит может повлиять на производительность
                </p>
              </div>
            </div>
          </RadioGroupOption>
        </RadioGroup>
      </div>

      <div class="flex justify-end">
        <SubmitButton class="cursor-pointer">
          Сохранить
        </SubmitButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleField from '../components/ui/ToggleField.vue';
import {RadioGroup, RadioGroupOption} from '@headlessui/vue';
import {ref, watch} from 'vue';
import InputField from "../components/ui/InputField.vue";
import SubmitButton from "../components/ui/SubmitButton.vue";

const securityOptions = ref({
  storeIpAddresses: true,
  allowedDomains: '',
  rateLimiting: 'default',
  customRateLimit: 100
});

watch(() => securityOptions.value.rateLimiting, (newVal) => {
  if (newVal !== 'custom') {
    securityOptions.value.customRateLimit = 100
  }
})

</script>

<style scoped>
.radio-option {
  transition: all 0.15s ease;
}

.radio-dot {
  transition: all 0.2s ease;
}
</style>