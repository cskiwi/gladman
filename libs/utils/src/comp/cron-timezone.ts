/**
 * Timezone the sync scheduler runs cron expressions in. Shared by the scheduler (SyncService)
 * and the admin UI so "next run" shows the moment the job actually fires.
 */
export const CRON_TIMEZONE = 'Europe/Brussels';
