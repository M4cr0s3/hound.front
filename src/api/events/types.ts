export interface Event {
	id: number;
	event_id: string;
	project_id: number;
	environment: string;
	type: string;
	level: 'error' | 'warning' | 'info';
	message: string;
	release: string | null;
	metadata: {
		file?: string;
		line?: number;
		context?: string;
		fingerprint: string;
		[key: string]: any;
	};
	count: number;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}
