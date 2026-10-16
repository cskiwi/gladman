import { SortableField, WhereField } from '@app/utils';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm';
import { ChangeEncounterParty } from '@app/models-enum';
import { CompetitionEncounterChangeDate } from './encounter-change-date.model';

@ObjectType('CompetitionEncounterChange', { description: 'Changes made to a competition encounter' })
@Entity('EncounterChanges', { schema: 'event' })
export class CompetitionEncounterChange extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @SortableField()
  @WhereField(() => Date)
  @CreateDateColumn({ type: 'timestamptz' })
  declare createdAt: Date;

  @SortableField({ nullable: true })
  @WhereField(() => Date, { nullable: true })
  @UpdateDateColumn({ type: 'timestamptz' })
  declare updatedAt: Date;

  @SortableField({ nullable: true })
  @WhereField({ nullable: true })
  @Column({ type: 'uuid', nullable: true })
  declare encounterId?: string;

  @SortableField(() => String, { nullable: false })
  @Column({ type: 'simple-enum', enum: ChangeEncounterParty, nullable: false })
  declare lastActionBy: ChangeEncounterParty;

  @SortableField(() => Date, { nullable: false })
  @WhereField(() => Date, { nullable: false })
  @Column({ nullable: false, type: 'timestamptz' })
  declare lastActionAt: Date;

  @Field(() => [CompetitionEncounterChangeDate], { nullable: true })
  @OneToMany(() => CompetitionEncounterChangeDate, (changeDate) => changeDate.encounterChange)
  declare changeDates?: Relation<CompetitionEncounterChangeDate[]>;
}
