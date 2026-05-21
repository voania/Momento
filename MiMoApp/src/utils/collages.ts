// ============================================================
// 拼图制作 — 后期用 @shopify/react-native-skia
// ============================================================

export interface CollageLayout {
  cols: number;
  rows: number;
  cells: Array<{ x: number; y: number; w: number; h: number }>;
}

export function getCollageLayout(count: number): CollageLayout {
  if (count <= 2) return gridLayout(1, count);
  if (count <= 4) return gridLayout(2, Math.ceil(count / 2));
  if (count <= 6) return gridLayout(2, 3);
  return gridLayout(3, Math.ceil(count / 3));
}

function gridLayout(cols: number, rows: number): CollageLayout {
  const cells: CollageLayout['cells'] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: c / cols, y: r / rows, w: 1 / cols, h: 1 / rows });
    }
  }
  return { cols, rows, cells };
}
