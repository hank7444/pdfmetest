import { Template, Font, checkTemplate, getInputFromTemplate, getDefaultFont } from '@pdfme/common';
import { Form, Viewer, Designer } from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import {
  multiVariableText,
  text,
  barcodes,
  image,
  svg,
  line,
  table,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  checkbox,
  radioGroup,
} from '@pdfme/schemas';
import plugins from './plugins';

export function fromKebabCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const getFontsData = (): Font => ({
  ...getDefaultFont(),
  NotoSerifJP: {
    fallback: false,
    data: 'https://fonts.gstatic.com/s/notoserifjp/v30/xn71YHs72GKoTvER4Gn3b5eMRtWGkp6o7MjQ2bwxOubAILO5wBCU.ttf',
  },
  NotoSansJP: {
    fallback: false,
    data: 'https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75vY0rw-oME.ttf',
  },
});

export const readFile = (file: File | null, type: 'text' | 'dataURL' | 'arrayBuffer') => {
  return new Promise<string | ArrayBuffer>((r) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', (e) => {
      if (e && e.target && e.target.result && file !== null) {
        r(e.target.result);
      }
    });
    if (file !== null) {
      if (type === 'text') {
        fileReader.readAsText(file);
      } else if (type === 'dataURL') {
        fileReader.readAsDataURL(file);
      } else if (type === 'arrayBuffer') {
        fileReader.readAsArrayBuffer(file);
      }
    }
  });
};

const getTemplateFromJsonFile = (file: File) => {
  return readFile(file, 'text').then((jsonStr) => {
    const template: Template = JSON.parse(jsonStr as string);
    checkTemplate(template);
    return template;
  });
};

export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });


export const downloadJsonFile = (json: unknown, title: string) => {
  if (typeof window !== 'undefined') {
    const blob = new Blob([JSON.stringify(json)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};

export const handleLoadTemplate = (
  e: React.ChangeEvent<HTMLInputElement>,
  currentRef: Designer | Form | Viewer | null
) => {
  if (e.target && e.target.files) {
    getTemplateFromJsonFile(e.target.files[0])
      .then((t) => {
        if (!currentRef) return;
        currentRef.updateTemplate(t);
      })
      .catch((e) => {
        alert(`Invalid template file.
--------------------------
${e}`);
      });
  }
};

export const getPlugins = () => {
  return {
    Text: text,
    'Multi-Variable Text': multiVariableText,
    Table: table,
    Line: line,
    Rectangle: rectangle,
    Ellipse: ellipse,
    Image: image,
    SVG: svg,
    Signature: plugins.signature,
    QR: barcodes.qrcode,
    DateTime: dateTime,
    Date: date,
    Time: time,
    Select: select,
    Checkbox: checkbox,
    RadioGroup: radioGroup,
    // JAPANPOST: barcodes.japanpost,
    EAN13: barcodes.ean13,
    // EAN8: barcodes.ean8,
    // Code39: barcodes.code39,
    Code128: barcodes.code128,
    // NW7: barcodes.nw7,
    // ITF14: barcodes.itf14,
    // UPCA: barcodes.upca,
    // UPCE: barcodes.upce,
    // GS1DataMatrix: barcodes.gs1datamatrix,
  };
};

export const getLittlePlugins = () => {
  return {
    Text: text,
    Line: line,
    Rectangle: rectangle,
    Ellipse: ellipse,
    Signature: plugins.signature,
    WidgetGroup: plugins.widgetGroup,
  };
}

export const translations: { label: string; value: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ko', label: 'Korean' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'th', label: 'Thai' },
  { value: 'pl', label: 'Polish' },
  { value: 'it', label: 'Italian' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
];

export const generatePDF = async (currentRef: Designer | Form | Viewer | null) => {
  if (!currentRef) return;
  const template = currentRef.getTemplate();
  const options = currentRef.getOptions();
  const inputs =
    typeof (currentRef as Viewer | Form).getInputs === 'function'
      ? (currentRef as Viewer | Form).getInputs()
      : getInputFromTemplate(template);
  const font = getFontsData();

  try {
    const pdf = await generate({
      template,
      inputs,
      options: {
        font,
        lang: options.lang,
        title: 'pdfme',
      },
      plugins: getPlugins(),
    });

    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  } catch (e) {
    alert(e + '\n\nCheck the console for full stack trace');
    throw e;
  }
};

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const DEFAULT_TEMPLATE_WIDTH = 210;
export const DEFAULT_TEMPLATE_HEIGHT = 297
export const DEFAULT_WIDGET_WIDTH = 100;
export const DEFAULT_WIDGET_HEIGHT = 60;

export const getBlankTemplate = () => {
  return ({
    schemas: [{}],
    basePdf: {
      width: DEFAULT_TEMPLATE_WIDTH,
      height: DEFAULT_TEMPLATE_HEIGHT,
      padding: [20, 10, 20, 10],
    },
  } as Template);
};

export const getTemplateById = async (templateId: string): Promise<Template> => {
  const template = await fetch(`/template-assets/${templateId}/template.json`).then((res) => res.json());
  checkTemplate(template);
  return template as Template;
};


export const displayJSONDataFromLocalStorage = (localStorageKey = '') => {
  // eslint-disable-next-line
  const formatJSONToHTML = (data: any): string => {
    if (typeof data === "object" && data !== null) {
      let htmlContent = "<ul>";

      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          htmlContent += `<li><span class="key">[${index}]:</span> ${formatJSONToHTML(item)}</li>`;
        });
      } else {
        Object.keys(data).forEach((key) => {
          htmlContent += `<li><span class="key">"${key}":</span> ${formatJSONToHTML(data[key])}</li>`;
        });
      }

      htmlContent += "</ul>";
      return htmlContent;
    } else if (typeof data === "string") {
      return `<span class="string">"${data}"</span>`;
    } else if (typeof data === "number") {
      return `<span class="number">${data}</span>`;
    } else if (typeof data === "boolean") {
      return `<span class="boolean">${data}</span>`;
    } else {
      return `<span class="null">null</span>`;
    }
  };

  try {
    const newTab = window.open("", "_blank");

    if (newTab) {
      newTab.document.write("<html><head><title>Widget Data</title></head><body>");
      newTab.document.write("<h1>Widget Data</h1>");
      newTab.document.write(`
        <style>
          body {
            font-family: 'Consolas', 'Monaco', monospace;
            background-color: #1e1e1e;
            color: #dcdcdc;
            margin: 0;
            padding: 20px;
          }
          pre {
            background-color: #252526;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
            color: #dcdcdc;
          }
          .key {
            color: #569cd6; /* VS Code key color */
            font-weight: bold;
          }
          .string {
            color: #dcdcaa; /* VS Code string color */
          }
          .number {
            color: #b5cea8; /* VS Code number color */
          }
          .boolean {
            color: #ce9178; /* VS Code boolean color */
          }
          .null {
            color: #808080; /* VS Code null color */
          }
          ul {
            list-style-type: none;
          }
        </style>
      `);

      const storedData = localStorage.getItem(localStorageKey);
      const parsedData = storedData ? JSON.parse(storedData) : null;

      if (parsedData) {
        newTab.document.write("<pre>" + formatJSONToHTML(parsedData) + "</pre>");
      } else {
        newTab.document.write("<p>No data found in localStorage.</p>");
      }

      newTab.document.write("</body></html>");
      newTab.document.close();
    } else {
      console.error("Failed to open new tab.");
    }
  } catch {
    //
  }
}