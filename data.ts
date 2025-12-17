import { Product, Category } from './types';

// REEMPLAZA ESTA URL CON TU LINK DE "PUBLICAR EN LA WEB" (FORMATO CSV)
const GOOGLE_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSzAtFap9uSBoWe6Texe_6ppGXfBmbj6ch7xK8wu785NfrPMLvY2TnEBkvNTbFPcf-hKkLJSNGPVRZB/pub?gid=0&single=true&output=csv';

// Backup data in case Sheet fails
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gran Pack Navideño Familiar (Backup)',
    description: 'La solución completa. Incluye vegetales de estación, frutas orgánicas, nueces, pan dulce artesanal y vino orgánico.',
    price: 58000,
    category: 'Packs Navidad',
    image: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d1?auto=format&fit=crop&q=80&w=800',
    isPromo: true,
    stock: 15,
    featured: true
  },
  {
    id: '2',
    name: 'Caja Huerta Navideña (Veggie)',
    description: 'Selección premium de verdes, tomates reliquia, zanahorias baby y mix de frutos secos.',
    price: 32000,
    category: 'Packs Navidad',
    image: 'https://images.unsplash.com/photo-1595855709990-c17122031961?auto=format&fit=crop&q=80&w=800',
    stock: 25,
    featured: true
  }
];

// Robust CSV Parser
const parseCSV = (text: string) => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote ("") inside quotes -> becomes single quote
          currentField += '"';
          i++; 
        } else {
          // End of quoted field
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        // End of field
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        // End of row
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim());
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        // Skip next char if it's \n after \r
        if (char === '\r' && nextChar === '\n') i++;
      } else {
        currentField += char;
      }
    }
  }
  
  // Push the last field/row if exists
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }

  // Extract headers (first row)
  if (rows.length === 0) return [];
  const headers = rows[0].map(h => h.toLowerCase().trim().replace(/^"|"$/g, ''));
  const body = rows.slice(1);

  return body.map(row => {
    const entry: any = {};
    headers.forEach((header, index) => {
      // Clean quotes from value if they persist
      let val = row[index] || '';
      // Simple unescape if not handled by parser loop fully (extra safety)
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      entry[header] = val;
    });
    return entry;
  });
};

export const fetchProducts = async (): Promise<Product[]> => {
  if (!GOOGLE_SHEET_CSV_URL) return FALLBACK_PRODUCTS;

  try {
    // CACHE BUSTING: Agregamos &t=TIMESTAMP al final de la URL
    // Esto obliga al navegador a pedir una copia nueva siempre y no usar la caché.
    const cacheBuster = `&t=${new Date().getTime()}`;
    const response = await fetch(GOOGLE_SHEET_CSV_URL + cacheBuster);
    
    const text = await response.text();
    const data = parseCSV(text);

    return data.map((row: any) => ({
      id: row.id || Math.random().toString(36).substr(2, 9),
      name: row.name,
      description: row.description,
      price: Number(row.price?.replace(/[^0-9.-]+/g,"")) || 0, // Clean price string (remove $ or ,)
      category: row.category ? row.category.trim() : 'General', // Use raw category from sheet
      image: row.image || 'https://via.placeholder.com/400?text=Sin+Imagen',
      stock: Number(row.stock) || 0,
      isPromo: row.ispromo?.toUpperCase() === 'TRUE',
      featured: row.featured?.toUpperCase() === 'TRUE'
    }));
  } catch (error) {
    console.warn('Error fetching Google Sheet, using fallback data:', error);
    return FALLBACK_PRODUCTS;
  }
};