import { EvaOption } from 'src/app/shared/interfaces/eva-options.interface';
import { EvaContext } from 'src/app/shared/interfaces/eva-response-context.interface';

/**
 * Modelo del objeto ChatMessage que contiene la información de un mensaje del chat.
 */
export class ChatMessage {
    
    public options?: EvaOption[];
    public shouldEnd?: boolean;
    public context?: EvaContext;
    public attachment?: any;
   
    type: CHATTYPE;
    caruselItems: any;
    message: string;
    buttons: EvaOption[];
    id: string;
    time: string;
    bot: boolean;
    image: string;
    audio: string;
    video: string;
    label: string;
    optionsForm: object;
    technicalText: object;

    static Builder = class {

        type: CHATTYPE;
        caruselItems: CarouselItem[];
        message: string;
        buttons: EvaOption[];
        id: string;
        time: string;
        fromBot: boolean;
        image: any
        audio: string;
        video: string;
        label: string;
        attachment: string;
        optionsForm: Object;
        technicalText: Object;

        constructor(type: CHATTYPE) {
            this.type = type;
        }

        withMessage(message: string) {
            this.message = message;
            return this;
        }
        withButtons(buttons: EvaOption[]) {
            this.buttons = buttons;
            return this;
        }

        withId(id: string) {
            this.id = id;
            return this;
        }

        withCarouselItems(caruselItems: any) {
            this.caruselItems = caruselItems;
            return this;
        }

        withTime(time: string){
            this.time = time;
            return this;
        }

        isFromBot(fromBot: boolean){
            this.fromBot = fromBot;
            return this;
        }

        withImage(image: string) {
            this.image = image;
            return this;
        }


        withAudio(audio: string) {
            this.audio = audio;
            return this;
        }

        withVideo(video: string) {
            this.video = video;
            return this;
        }

        withLabel(label: string) {
            this.label = label;
            return this;
        }

        withAttachment(attachment: string) {
            this.attachment = attachment;
            return this;
        }

        withOptionsForm(optionsForm: object) {
            this.optionsForm = optionsForm;
            return this;
        }

        withTechnicalText(technicalText: object) {
            this.technicalText = technicalText;
            return this;
        }

        build(){
            var chatMessage = new ChatMessage();
            chatMessage.id = this.id;
            chatMessage.caruselItems = this.caruselItems;
            chatMessage.message = this.message;
            chatMessage.buttons = this.buttons;
            chatMessage.time = this.time;
            chatMessage.bot = this.fromBot;
            chatMessage.type = this.type;
            chatMessage.image = this.image;
            chatMessage.video = this.video;
            chatMessage.audio = this.audio;
            chatMessage.label = this.label;
            chatMessage.attachment = this.attachment;
            chatMessage.optionsForm = this.optionsForm;
            chatMessage.technicalText = this.technicalText;

            return chatMessage;
        }
    }
    


    private constructor() {
    }
}


export class CarouselItem{
    imageUrl: string;
    title: string;
    subTitle: string;
    buttons: EvaOption[];
}



export enum CHATTYPE {
    CAROUSEL = 1,
    SIMPLETEXT = 2,
    OPTIONS = 3,
    AUDIO = 4,
    VIDEO = 5,
    FILE = 6,
    IMAGE = 7,
    OPTIONSFORM = 8, //Tipo especial de Technical Text para multiselectores
    TECHNICALTEXT = 9 // Cualquier otro Technical Text
}