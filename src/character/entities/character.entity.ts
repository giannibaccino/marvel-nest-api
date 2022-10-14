import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from "typeorm";
import { ComicEntity } from "./comic.entity";

@Entity('characters')
export class CharacterEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'int', nullable: false, unique: true})
    char_id: number;

    @Column({type: 'varchar', nullable: false})
    name: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({type: 'varchar', nullable: true})
    image:string;

    @Column({type: 'int', nullable: false})
    comicAmount: number;

    @ManyToMany(() => ComicEntity, (comic) => comic.characters)
    @JoinTable()
    comics: ComicEntity[];
}