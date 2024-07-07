import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
    // private dateRegex: RegExp = /(?:(\d{1,2})([/\-. ]?))?(\d{1,2}|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|janv(?:ier)?|fev(?:rier)?|mar(?:s)?|avr(?:il)?|mai|juin|juil(?:let)?|aou(?:t)?|sep(?:tembre)?|oct(?:obre)?|nov(?:embre)?|dec(?:embre)?)\b)?([/. ]?)((?:-?\d{4}))/gi;
    private dateRegex: RegExp = /(?:(\d{1,2})([/\-. ]?))?(\d{1,2}|\b(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?|janv(?:ier)?|fev(?:rier)?|mar(?:s)?|avr(?:il)?|mai|juin|juil(?:let)?|aou(?:t)?|sep(?:tembre)?|oct(?:obre)?|nov(?:embre)?|dec(?:embre)?)\b)?([/. ]?)((?:-?\d+))/gi

    private monthMap: { [key: string]: string } = {
        "jan": "01", "january": "01", "janv": "01", "janvier": "01",
        "feb": "02", "february": "02", "fev": "02", "fevrier": "02",
        "mar": "03", "march": "03", "mars": "03",
        "apr": "04", "april": "04", "avr": "04", "avril": "04",
        "may": "05", "mai": "05",
        "jun": "06", "june": "06", "juin": "06",
        "jul": "07", "july": "07", "juil": "07", "juillet": "07",
        "aug": "08", "august": "08", "aou": "08", "aout": "08",
        "sep": "09", "september": "09", "septembre": "09",
        "oct": "10", "october": "10", "octobre": "10",
        "nov": "11", "november": "11", "novembre": "11",
        "dec": "12", "december": "12", "decembre": "12"
    };

    parseCustomDate(dateString: string): string {
        try {
            if (!isNaN(+dateString)) {
                return `${dateString}:01:01`;
            }
            return dateString.toLowerCase().replace('é', 'e').replace('û', 'u').replace(this.dateRegex, (match: string, day: string, sep1: string, month: string, sep2: string, year: string) => {
                if (!month) {
                    month = day;
                    day = "01";
                }
                if (!day) {
                    day = "01";
                }
                if (!month) {
                    month = "01";
                } else if (isNaN(Number(month))) {
                    month = this.monthMap[month];
                }

                return `${year}:${month.padStart(2, '0')}:${day.padStart(2, '0')}`;
            });
        } catch (error: any) {
            console.error(`Error converting date: ${error.message}`);
            throw new Error(`Error converting date: ${error.message}`);
        }
    }
}
