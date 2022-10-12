import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from "typeorm";

@Entity('comics')
export class ComicEntity {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column({type: 'int', nullable: false, unique: true})
    id: number;

    @Column({type: 'varchar', nullable: false})
    title: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({type: 'varchar', nullable: true})
    image:string;

    @Column({type: 'varchar', nullable: false})
    resourceURI: string;;
}