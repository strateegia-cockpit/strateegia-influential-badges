import { Document, Paragraph, AlignmentType, TabStopPosition, HeadingLevel, TextRun } from "docx";
import { i18n } from "../translate/i18n";

export function saveFile() 
    {

    
        const doc = new Document({
            styles: {
                default: {
                    heading1: {
                        run: {
                            font: "Montserrat Bold",
                            size: 32,
                            bold: true,
                            color: "000000",
                        },
                        paragraph: {
                            alignment: AlignmentType.CENTER,
                            spacing: { line: 340 },
                        },
                    },
                },
                paragraphStyles: [
                    {
                        id: "normalPara",
                        name: "Normal Para",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            font: "Montserrat",
                            size: 24,
                            bold: false,
                        },
                        paragraph: {
                            spacing: { before: 0, after: 0 },
                            rightTabStop: TabStopPosition.MAX,
                            leftTabStop: 453.543307087,
                        },
                    },
                    
                ],
            },
            sections: [
                {
                    properties: {
                        page: {
                            margin: {
                                top: 700,
                                right: 700,
                                bottom: 700,
                                left: 700,
                            },
                        },
                    },
                    children: [
                        // heading
                        new Paragraph({
                            text: '[applet title here]',
                            heading: HeadingLevel.HEADING_1,
                            alignment: AlignmentType.LEFT,
                            break: 2,
                            
                        }),
                        new Paragraph({text: '', style: "normalPara"}),
                        new Paragraph({text: '', style: "normalPara"}),
                        // 1st paragraph
                        // [...]
                    ],
                },
            ],
        });

    return doc;

}
