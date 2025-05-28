import { type Event, httpClient, type Id, type Issue } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEventsStore = defineStore('events', () => {
  const events = ref<Event[]>([]);
  const event = ref<Event>({
    id: 0,
    name: '',
    description: '',
    type: '',
    level: 'info',
    metadata: {},
    event_id: '',
    count: 0,
    message: '',
    release: '',
    project_id: 0,
    environment: '',
    project: {} as Event['project'],
    issues: {} as Issue[]
  });
  const isLoading = ref(false);

  const fetchEvent = async (id: Id) => {
    isLoading.value = true;
    try {
      event.value = await httpClient.get(`/events/${id}`);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    events,
    event,

    fetchEvent,
  }
})