import { Process, Processor } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Job } from "bull";
import * as nodemailer from "nodemailer"

@Injectable()
@Processor('notifications')
export class TaskssProcessor {
    private readonly logger = new Logger(TaskssProcessor.name);
    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('MAIL_HOST'),
            port: this.configService.get<number>('MAIL_PORT'),
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
        });
    }

    @Process('task-due')
    async handleTaskDue(job: Job) {
        const { taskTitle, userEmail } = job.data;

        this.logger.log(`Enviando notificação para ${userEmail} - tarefa: ${taskTitle}`);

        await this.transporter.sendMail({
            from: this.configService.get('MAIL_FORM'),
            to: userEmail,
            subject: `Tarefa vencida ${taskTitle}`,
            html:`
                <h2>Sua tarefa venceu!</h2>
                <p>A tarefa <strong>${taskTitle}</strong> atingiu o prazo e ainda não foi concluída!</p>
                <p>Acesse o taskflow para atualizá-la.</p>
            `,
        });

        this.logger.log(`Notificação enviada com sucesso para ${userEmail}`)
    }
}