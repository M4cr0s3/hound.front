<template>
  <div>
    <div class="px-6 py-5">
      <h3 class="text-lg leading-6 font-medium text-gray-900">Security & Privacy</h3>
    </div>

    <div class="px-6 py-5 space-y-6">
      <!-- Data Scrubbing -->
      <ToggleField
          v-model="securityOptions.dataScrubbing"
          label="Data Scrubbing"
          description="Enable to scrub sensitive data (passwords, credit cards) from events."
      />

      <!-- IP Addresses -->
      <ToggleField
          v-model="securityOptions.storeIpAddresses"
          label="Store IP Addresses"
          description="Disable to stop collecting IP addresses."
      />

      <!-- CORS -->
      <InputField
          label="Allowed Domains"
          v-model="securityOptions.allowedDomains"
          type="textarea"
          description="List of domains (one per line) allowed to make requests to this project."
          placeholder="example.com\n*.example.com"
      />

      <!-- Rate Limiting -->
      <div class="space-y-4">
        <h4 class="text-sm font-medium text-gray-700">Rate Limiting</h4>
        <RadioGroup v-model="securityOptions.rateLimiting">
          <RadioGroupOption value="none" class="flex items-center space-x-3">
            <span>No limit</span>
          </RadioGroupOption>
          <RadioGroupOption value="default" class="flex items-center space-x-3 mt-2">
            <span>Default (100 events/minute)</span>
          </RadioGroupOption>
          <RadioGroupOption value="custom" class="flex items-center space-x-3 mt-2">
            <span>Custom:</span>
            <InputField
                v-model="securityOptions.customRateLimit"
                type="number"
                class="w-20"
                :disabled="securityOptions.rateLimiting !== 'custom'"
            />
            <span>events/minute</span>
          </RadioGroupOption>
        </RadioGroup>
      </div>

      <div class="flex justify-end">
        <button type="button" class="btn-primary">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ToggleField from '../components/ui/ToggleField.vue';
import { RadioGroup, RadioGroupOption } from '@headlessui/vue';
import { ref } from 'vue';

const securityOptions = ref({
  dataScrubbing: true,
  storeIpAddresses: true,
  allowedDomains: '',
  rateLimiting: 'default',
  customRateLimit: 100
});
</script>