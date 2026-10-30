import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTournamentScrapeCronJob1792886400000 implements MigrationInterface {
  name = 'SeedTournamentScrapeCronJob1792886400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "system"."CronJobs" ("id", "name", "type", "cronTime", "meta", "active", "createdAt", "updatedAt")
       SELECT gen_random_uuid(), $1::varchar, $2, $3, $4, true, NOW(), NOW()
       WHERE NOT EXISTS (SELECT 1 FROM "system"."CronJobs" WHERE "name" = $1::varchar)`,
      ['tournament-scrape', 'sync', '0 3 1 * *', JSON.stringify({ jobName: 'scheduleTournamentScrape', queueName: 'tournament-discovery' })],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "system"."CronJobs" WHERE "name" = $1`, ['tournament-scrape']);
  }
}
