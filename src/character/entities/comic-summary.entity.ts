import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity('comic-summarys')
export class ComicSummaryEntity {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'varchar', nullable: false})
    resourceURI: string;
}