import { addDays, subDays } from "date-fns";

export interface Categoria {
  id: string;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  valor_numerico: number;
  unidade_medida: string; // "Kg", "g", "L", "ml", "un"
  categoria_id: string;
  categoria: Categoria;
}

export interface Lote {
  id: string;
  produto_id: string;
  quantidade_disponivel: number;
  data_validade: Date;
  data_entrada: Date;
  status_validade: "valido" | "proximo_vencimento" | "vencido";
}

export interface Local {
  id: string;
  nome: string;
  tipo: "doador" | "beneficiario";
  documento: string;
}

export interface Movimentacao {
  id: string;
  tipo: "entrada" | "saida";
  data: Date;
  usuario_nome: string;
  origem?: Local;
  destino?: Local;
  itens: MovimentacaoLote[];
}

export interface MovimentacaoLote {
  id: string;
  lote_id: string;
  produto_nome: string;
  quantidade: number;
}

export interface ProdutoEstoque {
  produto: Produto;
  lotes: Lote[];
  total_disponivel: number;
  volume_total: string; // ex: "825 Kg", "350 L"
}

const now = new Date();

export const categorias: Categoria[] = [
  { id: "cat-1", nome: "Grãos e Cereais" },
  { id: "cat-2", nome: "Enlatados" },
  { id: "cat-3", nome: "Laticínios" },
  { id: "cat-4", nome: "Higiene" },
  { id: "cat-5", nome: "Hortifruti" },
  { id: "cat-6", nome: "Bebidas" },
];

export const produtos: Produto[] = [
  { id: "prod-1", nome: "Arroz Branco", descricao: "Arroz tipo 1", valor_numerico: 5, unidade_medida: "Kg", categoria_id: "cat-1", categoria: categorias[0] },
  { id: "prod-2", nome: "Feijão Carioca", descricao: "Feijão tipo 1", valor_numerico: 1, unidade_medida: "Kg", categoria_id: "cat-1", categoria: categorias[0] },
  { id: "prod-3", nome: "Leite Integral", descricao: "Leite UHT", valor_numerico: 1, unidade_medida: "L", categoria_id: "cat-3", categoria: categorias[2] },
  { id: "prod-4", nome: "Milho em Conserva", descricao: "Milho verde", valor_numerico: 200, unidade_medida: "g", categoria_id: "cat-2", categoria: categorias[1] },
  { id: "prod-5", nome: "Macarrão Espaguete", descricao: "Massa seca", valor_numerico: 500, unidade_medida: "g", categoria_id: "cat-1", categoria: categorias[0] },
  { id: "prod-6", nome: "Sabonete", descricao: "Sabonete em barra", valor_numerico: 90, unidade_medida: "g", categoria_id: "cat-4", categoria: categorias[3] },
  { id: "prod-7", nome: "Banana Prata", descricao: "Banana prata", valor_numerico: 1, unidade_medida: "Kg", categoria_id: "cat-5", categoria: categorias[4] },
  { id: "prod-8", nome: "Açúcar Refinado", descricao: "Açúcar tipo cristal", valor_numerico: 1, unidade_medida: "Kg", categoria_id: "cat-1", categoria: categorias[0] },
  { id: "prod-9", nome: "Suco de Laranja", descricao: "Suco concentrado", valor_numerico: 500, unidade_medida: "ml", categoria_id: "cat-6", categoria: categorias[5] },
];

export const lotes: Lote[] = [
  { id: "lot-1", produto_id: "prod-1", quantidade_disponivel: 120, data_validade: addDays(now, 90), data_entrada: subDays(now, 10), status_validade: "valido" },
  { id: "lot-2", produto_id: "prod-1", quantidade_disponivel: 45, data_validade: addDays(now, 5), data_entrada: subDays(now, 30), status_validade: "proximo_vencimento" },
  { id: "lot-3", produto_id: "prod-2", quantidade_disponivel: 80, data_validade: addDays(now, 60), data_entrada: subDays(now, 15), status_validade: "valido" },
  { id: "lot-4", produto_id: "prod-3", quantidade_disponivel: 200, data_validade: addDays(now, 3), data_entrada: subDays(now, 20), status_validade: "proximo_vencimento" },
  { id: "lot-5", produto_id: "prod-3", quantidade_disponivel: 150, data_validade: addDays(now, 30), data_entrada: subDays(now, 5), status_validade: "valido" },
  { id: "lot-6", produto_id: "prod-4", quantidade_disponivel: 60, data_validade: addDays(now, 180), data_entrada: subDays(now, 7), status_validade: "valido" },
  { id: "lot-7", produto_id: "prod-5", quantidade_disponivel: 90, data_validade: addDays(now, 120), data_entrada: subDays(now, 12), status_validade: "valido" },
  { id: "lot-8", produto_id: "prod-6", quantidade_disponivel: 300, data_validade: addDays(now, 365), data_entrada: subDays(now, 3), status_validade: "valido" },
  { id: "lot-9", produto_id: "prod-7", quantidade_disponivel: 25, data_validade: addDays(now, 2), data_entrada: subDays(now, 4), status_validade: "proximo_vencimento" },
  { id: "lot-10", produto_id: "prod-8", quantidade_disponivel: 55, data_validade: addDays(now, 150), data_entrada: subDays(now, 8), status_validade: "valido" },
  { id: "lot-11", produto_id: "prod-2", quantidade_disponivel: 30, data_validade: subDays(now, 2), data_entrada: subDays(now, 45), status_validade: "vencido" },
  { id: "lot-12", produto_id: "prod-9", quantidade_disponivel: 80, data_validade: addDays(now, 45), data_entrada: subDays(now, 6), status_validade: "valido" },
  // Historical lots for sparkline data
  { id: "lot-13", produto_id: "prod-1", quantidade_disponivel: 0, data_validade: subDays(now, 10), data_entrada: subDays(now, 60), status_validade: "vencido" },
  { id: "lot-14", produto_id: "prod-1", quantidade_disponivel: 0, data_validade: subDays(now, 5), data_entrada: subDays(now, 45), status_validade: "vencido" },
  { id: "lot-15", produto_id: "prod-3", quantidade_disponivel: 0, data_validade: subDays(now, 15), data_entrada: subDays(now, 50), status_validade: "vencido" },
];

export const locais: Local[] = [
  { id: "loc-1", nome: "Supermercado Bom Preço", tipo: "doador", documento: "12.345.678/0001-90" },
  { id: "loc-2", nome: "Fazenda São José", tipo: "doador", documento: "98.765.432/0001-10" },
  { id: "loc-3", nome: "Associação Comunitária Vila Nova", tipo: "beneficiario", documento: "11.222.333/0001-44" },
  { id: "loc-4", nome: "Centro Social Esperança", tipo: "beneficiario", documento: "55.666.777/0001-88" },
  { id: "loc-5", nome: "Escola Municipal Jardim das Flores", tipo: "beneficiario", documento: "99.888.777/0001-22" },
  { id: "loc-6", nome: "Padaria Central", tipo: "doador", documento: "33.444.555/0001-66" },
];

export const movimentacoes: Movimentacao[] = [
  {
    id: "mov-1", tipo: "entrada", data: subDays(now, 1), usuario_nome: "Ana Silva",
    origem: locais[0],
    itens: [
      { id: "mi-1", lote_id: "lot-1", produto_nome: "Arroz Branco", quantidade: 50 },
      { id: "mi-2", lote_id: "lot-3", produto_nome: "Feijão Carioca", quantidade: 30 },
    ],
  },
  {
    id: "mov-2", tipo: "saida", data: subDays(now, 1), usuario_nome: "Carlos Mendes",
    destino: locais[2],
    itens: [
      { id: "mi-3", lote_id: "lot-4", produto_nome: "Leite Integral", quantidade: 40 },
    ],
  },
  {
    id: "mov-3", tipo: "entrada", data: subDays(now, 3), usuario_nome: "Ana Silva",
    origem: locais[1],
    itens: [
      { id: "mi-4", lote_id: "lot-9", produto_nome: "Banana Prata", quantidade: 25 },
    ],
  },
  {
    id: "mov-4", tipo: "saida", data: subDays(now, 5), usuario_nome: "Beatriz Lima",
    destino: locais[3],
    itens: [
      { id: "mi-5", lote_id: "lot-7", produto_nome: "Macarrão Espaguete", quantidade: 20 },
      { id: "mi-6", lote_id: "lot-1", produto_nome: "Arroz Branco", quantidade: 15 },
    ],
  },
  {
    id: "mov-5", tipo: "entrada", data: subDays(now, 7), usuario_nome: "Ana Silva",
    origem: locais[5],
    itens: [
      { id: "mi-7", lote_id: "lot-8", produto_nome: "Sabonete", quantidade: 100 },
    ],
  },
  {
    id: "mov-6", tipo: "saida", data: subDays(now, 10), usuario_nome: "Carlos Mendes",
    destino: locais[4],
    itens: [
      { id: "mi-8", lote_id: "lot-6", produto_nome: "Milho em Conserva", quantidade: 15 },
    ],
  },
  {
    id: "mov-7", tipo: "entrada", data: subDays(now, 14), usuario_nome: "Beatriz Lima",
    origem: locais[0],
    itens: [
      { id: "mi-9", lote_id: "lot-5", produto_nome: "Leite Integral", quantidade: 150 },
      { id: "mi-10", lote_id: "lot-10", produto_nome: "Açúcar Refinado", quantidade: 55 },
    ],
  },
  {
    id: "mov-8", tipo: "entrada", data: subDays(now, 21), usuario_nome: "Ana Silva",
    origem: locais[1],
    itens: [
      { id: "mi-11", lote_id: "lot-12", produto_nome: "Suco de Laranja", quantidade: 80 },
    ],
  },
];

/**
 * Calculate volumetric display string
 * Converts quantity × valor_numerico into a readable volume/weight string
 */
export function formatVolume(produto: Produto, quantidade: number): string {
  const total = quantidade * produto.valor_numerico;
  const unit = produto.unidade_medida;

  // Normalize small units to larger ones
  if (unit === "g" && total >= 1000) {
    return `${(total / 1000).toFixed(1).replace(/\.0$/, "")} Kg`;
  }
  if (unit === "ml" && total >= 1000) {
    return `${(total / 1000).toFixed(1).replace(/\.0$/, "")} L`;
  }

  return `${total.toLocaleString("pt-BR")} ${unit}`;
}

export function getEstoque(): ProdutoEstoque[] {
  return produtos.map((p) => {
    const prodLotes = lotes.filter((l) => l.produto_id === p.id && l.status_validade !== "vencido");
    const totalDisponivel = prodLotes.reduce((sum, l) => sum + l.quantidade_disponivel, 0);
    return {
      produto: p,
      lotes: prodLotes.sort((a, b) => a.data_validade.getTime() - b.data_validade.getTime()),
      total_disponivel: totalDisponivel,
      volume_total: formatVolume(p, totalDisponivel),
    };
  }).filter(e => e.total_disponivel > 0);
}

/**
 * Get all lots (including expired) for a product — used for sparkline history
 */
export function getLoteHistorico(produtoId: string): Lote[] {
  return lotes
    .filter((l) => l.produto_id === produtoId)
    .sort((a, b) => a.data_entrada.getTime() - b.data_entrada.getTime());
}
