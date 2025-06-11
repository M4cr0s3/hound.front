import { type Event, httpClient, type Id } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEventsStore = defineStore('events', () => {
  const events = ref<Event[]>([]);
  const event = ref<Event>({
    id: 0,
    type: '',
    level: 'info',
    metadata: {
      '': '',
      fingerprint: ''
    },
    event_id: '',
    count: 0,
    message: '',
    release: '',
    project_id: 0,
    environment: '',
    project: {} as Event['project'],
    issues: [],
    created_at: '',
    updated_at: '',
    deleted_at: null,
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
