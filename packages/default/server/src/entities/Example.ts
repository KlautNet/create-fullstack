import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm"

@Entity()
export class Example {
    @PrimaryColumn()
    id: number

    @Column()
    name: string

    @CreateDateColumn()
    created_at: Date
}