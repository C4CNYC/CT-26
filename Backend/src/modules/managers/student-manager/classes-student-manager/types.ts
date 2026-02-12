import { LessonType } from "@/modules/core/lesson/enums/lesson-type.enum";

export type ProgressResult = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    courses: {
        id: string;
        name: string;
        content_id: string;
        description: string;
        due_date: string;
        progress: number;
        modules: {
            id: string;
            name: string;
            description: string;
            progress: number;
            lessons: {
                id: string;
                name: string;
                progress: number;
                autoGraded: boolean;
                core: boolean;
                type: LessonType;
                slides: {
                    id: string;
                    name: string;
                    description: string;
                    progress: string;
                }[];
            }[];
        }[];
    }[];
}