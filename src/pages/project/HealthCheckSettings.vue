<template>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold text-gray-900">Настройки Healthcheck</h1>
		</div>

		<div class="bg-white shadow-sm rounded-lg mb-8">
			<div class="px-4 py-5 sm:p-6">
				<h2 class="text-lg font-medium text-gray-900 mb-4">
					Добавить новый эндпоинт для проверки состояния
				</h2>
				<form @submit.prevent="handleAddEndpoint">
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<InputField
							id="url"
							v-model="form.url"
							label="Ссылка"
							type="text"
							placeholder="https://example.com"
							required
						/>

						<SelectField
							v-model="form.method"
							:options="httpMethods"
							label="Метод"
							placeholder="Выберите метод"
						/>

						<InputField
							id="expected_status"
							v-model="form.expected_status"
							label="Ожидаемый статус код"
							type="number"
							placeholder="200"
							required
							:minValue="1"
							:maxValue="550"
						/>

						<InputField
							id="interval"
							v-model="form.interval"
							label="Интервал между проверками (в минутах)"
							type="number"
							placeholder="1"
							required
							:minValue="1"
							:maxValue="60"
						/>

						<Checkbox
							id="is_active"
							v-model="form.is_active"
							label="Активность мониторинга"
						/>
					</div>

					<div class="mt-6">
						<button
							type="submit"
							class="w-full cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							:disabled="healthCheckStore.isAdding"
						>
							<span v-if="healthCheckStore.isAdding">Добавляем...</span>
							<span v-else>Добавить</span>
						</button>
					</div>
				</form>
			</div>
		</div>

		<div class="bg-white rounded-lg border border-gray-200 mt-4">
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-lg font-medium text-gray-900">
          Текущий список эндпоинтов
        </h2>
      </div>
			<div class="px-4 py-5 sm:p-6">
				<div
					v-if="healthCheckStore.isLoading"
					class="space-y-4"
				>
					<div
						v-for="i in 3"
						:key="i"
						class="animate-pulse"
					>
						<div class="h-16 bg-gray-100 rounded-md"></div>
					</div>
				</div>

				<div
					v-else-if="healthCheckStore.endpoints.length === 0"
					class="text-center py-8"
				>
					<p class="text-gray-500">Пока что ничего нет.</p>
				</div>

				<ul
					v-else
					class="space-y-4"
				>
					<li
						v-for="endpoint in healthCheckStore.endpoints"
						:key="endpoint.id"
						class="border border-gray-200 rounded-md p-4"
					>
						<div class="flex justify-between items-start">
							<div>
								<div class="flex items-center space-x-2">
									<span class="font-medium">{{ endpoint.method }}</span>
									<RouterLink
										:to="`/healthcheck/${endpoint.id}/results`"
										class="text-gray-600"
										>{{ endpoint.url }}</RouterLink
									>
									<span
										class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
										:class="
											endpoint.is_active
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										"
									>
										{{ endpoint.is_active ? 'Активен' : 'Неактивен' }}
									</span>
								</div>
								<div class="mt-2 text-sm text-gray-500">
									<span>Ожидаемый статус: {{ endpoint.expected_status }}</span>
									<span class="mx-2">•</span>
									<span>Интервал: каждые {{ endpoint.interval }} мин.</span>
								</div>
							</div>
							<div class="flex space-x-2">
								<button
									@click="toggleEndpointStatus(endpoint)"
									class="text-gray-400 hover:text-gray-500"
									:title="endpoint.is_active ? 'Disable' : 'Enable'"
								>
									<Icon
										:icon="
											endpoint.is_active
												? 'heroicons:eye'
												: 'heroicons:eye-slash'
										"
										class="h-5 w-5 cursor-pointer"
									/>
								</button>
								<button
									@click="deleteEndpoint(endpoint)"
									class="text-gray-400 hover:text-red-500"
									title="Delete"
								>
									<Icon
										icon="heroicons:trash"
										class="h-5 w-5 cursor-pointer"
									/>
								</button>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Checkbox, InputField, SelectField } from '@/components/ui';
import {
	useHealthCheckStore,
	type HealthCheckEndpointForm,
} from '@/stores';
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const slug = route.params.slug as string;
const healthCheckStore = useHealthCheckStore();

const httpMethods = [
	'GET',
	'POST',
	'PUT',
	'PATCH',
	'DELETE',
	'HEAD',
	'OPTIONS',
];

const form = ref<HealthCheckEndpointForm>({
	url: '',
	method: 'GET',
	expected_status: 200,
	interval: 5,
	is_active: true,
});

const handleAddEndpoint = async () => {
	try {
		await healthCheckStore.addEndpoint(slug, form.value);
		form.value = {
			url: '',
			method: 'GET',
			expected_status: 200,
			interval: 5,
			is_active: true,
		};
	} catch (error) {
		console.error('Error adding endpoint:', error);
	}
};

const toggleEndpointStatus = async (endpoint: { id: number }) => {
	try {
		await healthCheckStore.toggleEndpointStatus(endpoint.id);
	} catch (error) {
		console.error('Error toggling endpoint status:', error);
	}
};

const deleteEndpoint = async (endpoint: { id: number }) => {
	if (!confirm('Are you sure you want to delete this endpoint?')) return;

	try {
		await healthCheckStore.deleteEndpoint(endpoint.id);
	} catch (error) {
		console.error('Error deleting endpoint:', error);
	}
};

onMounted(async () => {
	await healthCheckStore.fetchEndpoints(slug);
});
</script>
