<template>
	<div class="bg-white shadow rounded-lg">
		<div class="px-4 py-5 sm:px-6 border-b border-gray-200">
			<h3 class="text-lg leading-6 font-medium text-gray-900">Ваши проекты</h3>
		</div>
		<div class="bg-white overflow-hidden">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Проект
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Ошибки (24ч)
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Статус
						</th>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Команда
						</th>
						<th
							scope="col"
							class="relative px-6 py-3"
						>
							<span class="sr-only">Редактировать</span>
						</th>
					</tr>
				</thead>
				<tbody class="bg-white divide-y divide-gray-200">
					<tr
						v-for="project in projects"
						:key="project.id"
						class="hover:bg-gray-50"
					>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								<div
									class="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center"
									:class="project.bgColor"
								>
									<component
										:is="project.icon"
										class="h-6 w-6 text-white"
									/>
								</div>
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">
										{{ project.name }}
									</div>
									<div class="text-sm text-gray-500">
										{{ project.platform }}
									</div>
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{{ project.errors }}</div>
							<div class="text-sm text-gray-500">
								{{ project.resolved }} решено
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<span
								class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
								:class="project.statusClass"
							>
								{{ project.status }}
							</span>
						</td>
						<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
							<div class="flex -space-x-2">
								<img
									v-for="member in project.team"
									:key="member.id"
									class="h-8 w-8 rounded-full border-2 border-white"
									:src="member.avatar"
									:alt="member.name"
								/>
							</div>
						</td>
						<td
							class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
						>
							<a
								href="#"
								class="text-indigo-600 hover:text-indigo-900"
								>Настройки</a
							>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup lang="ts">
const projects = [
	{
		id: 1,
		name: 'showcase.front',
		platform: 'JavaScript',
		bgColor: 'bg-indigo-500',
		errors: 42,
		resolved: 38,
		status: 'Active',
		statusClass: 'bg-green-100 text-green-800',
		icon: 'heroicons:sparkles',
		team: [
			{
				id: 1,
				name: 'John Doe',
				avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
			},
			{
				id: 2,
				name: 'Jane Smith',
				avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
			},
		],
	},
	{
		id: 2,
		name: 'rn-app.mobile',
		platform: 'React Native',
		bgColor: 'bg-green-500',
		errors: 28,
		resolved: 25,
		status: 'Active',
		statusClass: 'bg-green-100 text-green-800',
		team: [
			{
				id: 3,
				name: 'Bob Johnson',
				avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
			},
		],
	},
	{
		id: 3,
		name: 'api-news.back',
		platform: 'Golang',
		bgColor: 'bg-yellow-500',
		errors: 15,
		resolved: 12,
		status: 'Warning',
		statusClass: 'bg-yellow-100 text-yellow-800',
		team: [
			{
				id: 1,
				name: 'John Doe',
				avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
			},
			{
				id: 4,
				name: 'Alice Brown',
				avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
			},
		],
	},
];
</script>
