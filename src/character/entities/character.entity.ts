import { ComicSummaryEntity } from "src/character/entities/comic-summary.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";

@Entity('characters')
export class CharacterEntity {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column({type: 'int', nullable: false, unique: true})
    id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({type: 'varchar', nullable: true})
    image:string;

    @ManyToMany(() => ComicSummaryEntity)
    @JoinTable()
    comics: ComicSummaryEntity[];
}