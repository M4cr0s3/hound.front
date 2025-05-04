<template>
	<div class="bg-white shadow rounded-lg mb-6">
		<div class="px-4 py-5 sm:px-6 border-b border-gray-200">
			<h3 class="text-lg leading-6 font-medium text-gray-900">
				Недавние задачи
			</h3>
		</div>
		<div class="bg-white overflow-hidden">
			<ul class="divide-y divide-gray-200">
				<li
					v-for="issue in issues"
					:key="issue.id"
				>
					<a
						href="#"
						class="block hover:bg-gray-50"
					>
						<div class="px-4 py-4 sm:px-6">
							<div class="flex items-center justify-between">
								<p class="text-sm font-medium text-indigo-600 truncate">
									{{ issue.title }}
								</p>
								<div class="ml-2 flex-shrink-0 flex">
									<p
										class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
										:class="issue.statusClass"
									>
										{{ issue.status }}
									</p>
								</div>
							</div>
							<div class="mt-2 sm:flex sm:justify-between">
								<div class="sm:flex">
									<p class="flex items-center text-sm text-gray-500">
										{{ issue.type }}
									</p>
									<p
										class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6"
									>
										{{ issue.project }}
									</p>
								</div>
								<div
									class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
								>
									<p>
										Замечена последний раз
										<time :datetime="issue.datetime">{{ issue.time }}</time>
									</p>
								</div>
							</div>
						</div>
					</a>
				</li>
			</ul>
		</div>
		<div class="px-4 py-4 sm:px-6 border-t border-gray-200">
			<button
				class="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500"
			>
				Посмотреть все задачи
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
const issues = [
	{
		id: 1,
		title: 'TypeError: Cannot read property of undefined',
		status: 'Не решена',
		statusClass: 'bg-yellow-100 text-yellow-800',
		type: 'JavaScript',
		project: 'Web App',
		datetime: '2023-05-21',
		time: '3 дня назад',
	},
	{
		id: 2,
		title: 'NetworkError when attempting to fetch resource',
		status: 'Решена',
		statusClass: 'bg-green-100 text-green-800',
		type: 'Network',
		project: 'Mobile App',
		datetime: '2023-05-20',
		time: '4 дня назад',
	},
	{
		id: 3,
		title: 'Database connection timeout',
		status: 'Проигнорирована',
		statusClass: 'bg-gray-100 text-gray-800',
		type: 'Backend',
		project: 'API Service',
		datetime: '2023-05-18',
		time: '6 дней назад',
	},
];
</script>
