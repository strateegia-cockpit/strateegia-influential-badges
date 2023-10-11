import { Box } from "@chakra-ui/react";
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
import { ButtonExp } from "./ButtonToExport";
import { approximateNumber } from "../utils/numerHandling";

const transformHeaders = (data) => {
 if (data === '') return data;
 return data.map(item => {
  return {
    'ação': item.metrica1,
    'impacto': item.metrica2,
    'colaboração': item.score,
    'média': item.totalAverage,
    'media normalizada': item.normalizedTotalAverage,
    'média por blocos': approximateNumber(item.normalizedTotalAverage),
  };
});
};


export function ExportsButtons({ project, data, saveFile }) {
  
  const transformedData = transformHeaders(data);

  const exportToXLSX = (transformedData) => {
    const ws = XLSX.utils.json_to_sheet(transformedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    XLSX.writeFile(wb, "strateegia_influential_report.xlsx");
  };

  return (
    <Box display="flex" justifyContent="flex-end" alignItems='flex-end' m='4px'>
      <ButtonExp click={saveFile} project={project} text='docx'/>
      <CSVLink
        data={transformedData}
        filename="strateegia_influential_report-csv.csv"
      >
        <ButtonExp click={null} project={project} text='csv'/>
      </CSVLink>
      <ButtonExp click={() => exportJSONData(data)} project={project} text='json'/>
      <ButtonExp click={() => exportToXLSX(transformedData)} project={project} text='xlsx'/>
    </Box>
  );
}

export const exportJSONData = (data) => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    JSON.stringify(data)
  )}`;

  const link = document.createElement("a");
  link.href = jsonString;
  link.download = "strateegia_influential_report-json.json";

  link.click();
};
