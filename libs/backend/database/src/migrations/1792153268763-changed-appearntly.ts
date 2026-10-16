import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedAppearntly1792153268763 implements MigrationInterface {
    name = 'ChangedAppearntly1792153268763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "ranking"."ranking_places_system_player_date_idx"
        `);
        await queryRunner.query(`
            ALTER TYPE "event"."enum_EncounterChanges_lastActionBy"
            RENAME TO "enum_EncounterChanges_lastActionBy_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "event"."EncounterChanges_lastactionby_enum" AS ENUM('HOME', 'AWAY')
        `);
        await queryRunner.query(`
            ALTER TABLE "event"."EncounterChanges"
            ALTER COLUMN "lastActionBy" TYPE "event"."EncounterChanges_lastactionby_enum" USING "lastActionBy"::"text"::"event"."EncounterChanges_lastactionby_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "event"."enum_EncounterChanges_lastActionBy_old"
        `);
        await queryRunner.query(`
            ALTER TYPE "event"."enum_EncounterChangeDates_proposedBy"
            RENAME TO "enum_EncounterChangeDates_proposedBy_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "event"."EncounterChangeDates_proposedby_enum" AS ENUM('HOME', 'AWAY')
        `);
        await queryRunner.query(`
            ALTER TABLE "event"."EncounterChangeDates"
            ALTER COLUMN "proposedBy" TYPE "event"."EncounterChangeDates_proposedby_enum" USING "proposedBy"::"text"::"event"."EncounterChangeDates_proposedby_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "event"."enum_EncounterChangeDates_proposedBy_old"
        `);
        await queryRunner.query(`
            ALTER TYPE "event"."enum_EncounterChangeDates_status"
            RENAME TO "enum_EncounterChangeDates_status_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "event"."EncounterChangeDates_status_enum" AS ENUM(
                'PENDING',
                'TENTATIVELY_ACCEPTED',
                'ACCEPTED',
                'REJECTED',
                'RESOLVED'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "event"."EncounterChangeDates"
            ALTER COLUMN "status" TYPE "event"."EncounterChangeDates_status_enum" USING "status"::"text"::"event"."EncounterChangeDates_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "event"."enum_EncounterChangeDates_status_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "event"."enum_EncounterChangeDates_status_old" AS ENUM(
                'ACCEPTED',
                'PENDING',
                'REJECTED',
                'RESOLVED',
                'TENTATIVELY_ACCEPTED'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "event"."EncounterChangeDates"
            ALTER COLUMN "status" TYPE "event"."enum_EncounterChangeDates_status_old" USING "status"::"text"::"event"."enum_EncounterChangeDates_status_old"
        `);
        await queryRunner.query(`
            DROP TYPE "event"."EncounterChangeDates_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "event"."enum_EncounterChangeDates_status_old"
            RENAME TO "enum_EncounterChangeDates_status"
        `);
        await queryRunner.query(`
            CREATE TYPE "event"."enum_EncounterChangeDates_proposedBy_old" AS ENUM('AWAY', 'HOME')
        `);
        await queryRunner.query(`
            ALTER TABLE "event"."EncounterChangeDates"
            ALTER COLUMN "proposedBy" TYPE "event"."enum_EncounterChangeDates_proposedBy_old" USING "proposedBy"::"text"::"event"."enum_EncounterChangeDates_proposedBy_old"
        `);
        await queryRunner.query(`
            DROP TYPE "event"."EncounterChangeDates_proposedby_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "event"."enum_EncounterChangeDates_proposedBy_old"
            RENAME TO "enum_EncounterChangeDates_proposedBy"
        `);
        await queryRunner.query(`
            CREATE TYPE "event"."enum_EncounterChanges_lastActionBy_old" AS ENUM('AWAY', 'HOME')
        `);
        await queryRunner.query(`
            ALTER TABLE "event"."EncounterChanges"
            ALTER COLUMN "lastActionBy" TYPE "event"."enum_EncounterChanges_lastActionBy_old" USING "lastActionBy"::"text"::"event"."enum_EncounterChanges_lastActionBy_old"
        `);
        await queryRunner.query(`
            DROP TYPE "event"."EncounterChanges_lastactionby_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "event"."enum_EncounterChanges_lastActionBy_old"
            RENAME TO "enum_EncounterChanges_lastActionBy"
        `);
        await queryRunner.query(`
            CREATE INDEX "ranking_places_system_player_date_idx" ON "ranking"."RankingPlaces" ("rankingDate", "playerId", "systemId")
        `);
    }

}
