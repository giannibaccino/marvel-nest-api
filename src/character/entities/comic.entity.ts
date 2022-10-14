import { Entity, PrimaryGeneratedColumn, Column, ManyToMany} from "typeorm";
import { CharacterEntity } from "./character.entity";

@Entity('comics')
export class ComicEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'int', nullable: false, unique: true})
    com_id: number;

    @Column({type: 'varchar', nullable: false})
    title: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({type: 'varchar', nullable: true})
    image:string;

    @Column({type: 'varchar', nullable: false})
    resourceURI: string;

    @ManyToMany(() => CharacterEntity, (character) => character.comics)
    characters: CharacterEntity[];
}