# -*- coding: utf-8 -*-
import openpyxl
from openpyxl.utils import get_column_letter
import json
import glob
import sys

# Configurar encoding para UTF-8
sys.stdout.reconfigure(encoding='utf-8')

# Encontrar a planilha
excel_files = glob.glob('*.xlsx')
if not excel_files:
    print("Nenhum arquivo Excel encontrado!")
    exit(1)

planilha = excel_files[0]
print(f"Analisando: {planilha}\n")

# Carregar a planilha COM valores calculados
wb_valores = openpyxl.load_workbook(planilha, data_only=True)
# Carregar a planilha SEM valores calculados (para ver fórmulas)
wb_formulas = openpyxl.load_workbook(planilha, data_only=False)

print("=" * 100)
print("DOCUMENTACAO COMPLETA DA LOGICA DE NEGOCIO - MAPEADOR DE PRECOS")
print("=" * 100)

# ============================================================================
# ABA: Mineração - Principal para cálculo de lucro dos produtos
# ============================================================================
print("\n\n" + "=" * 100)
print("ABA: Mineracao - ANALISE DETALHADA")
print("=" * 100)

ws_val = wb_valores['Mineração']
ws_form = wb_formulas['Mineração']

# Extrair as premissas (constantes usadas nos cálculos)
print("\n[PREMISSAS / CONSTANTES]")
print("Estas são as variáveis fixas usadas em todos os cálculos:")
print("-" * 100)

premissas = {}
# Ler as premissas das primeiras linhas
for row in range(1, 10):
    label_cell = ws_val.cell(row, 2)  # Coluna B
    value_cell = ws_val.cell(row, 3)  # Coluna C
    if label_cell.value and value_cell.value:
        label = str(label_cell.value).strip()
        if label and label not in ['Produto', 'Fornecedor']:
            try:
                value = float(value_cell.value)
                premissas[label] = value
                print(f"   {label}: {value}")
            except:
                pass

# Identificar a linha de cabeçalho dos produtos
print("\n[ESTRUTURA DA TABELA DE PRODUTOS]")
print("-" * 100)

header_row = None
for row in range(1, 15):
    cell = ws_val.cell(row, 2)
    if cell.value == 'Produto':
        header_row = row
        break

if header_row:
    print(f"Linha de cabeçalho encontrada: Linha {header_row}")
    print("\nColunas da tabela:")
    headers_info = []
    for col in range(1, ws_val.max_column + 1):
        cell_val = ws_val.cell(header_row, col)
        cell_form = ws_form.cell(header_row, col)
        if cell_val.value:
            col_letter = get_column_letter(col)
            headers_info.append({
                'coluna': col_letter,
                'nome': str(cell_val.value),
                'indice': col
            })
            print(f"   {col_letter}: {cell_val.value}")
    
    # Analisar as fórmulas de cálculo
    print("\n[LOGICA DE CALCULO DOS PRODUTOS]")
    print("-" * 100)
    print("Analisando a primeira linha de produto para entender a lógica...")
    
    first_product_row = header_row + 1
    
    print(f"\nExemplo: Linha {first_product_row}")
    for col_info in headers_info:
        col = col_info['indice']
        cell_val = ws_val.cell(first_product_row, col)
        cell_form = ws_form.cell(first_product_row, col)
        
        print(f"\n   {col_info['coluna']} - {col_info['nome']}:")
        print(f"      Valor: {cell_val.value}")
        
        if cell_form.value and isinstance(cell_form.value, str) and cell_form.value.startswith('='):
            print(f"      Formula: {cell_form.value}")
            
            # Explicar a fórmula
            formula = cell_form.value.upper()
            explicacao = ""
            
            if 'IFERROR' in formula and '/' in formula:
                if '-' in formula:
                    explicacao = "CALCULO DE MARGEM: (Receita - Custos) / Receita"
                    # Identificar os componentes
                    if 'E' in formula and 'D' in formula:
                        explicacao += f"\n         Receita = Preco de Venda (coluna E)"
                        explicacao += f"\n         Custos incluem: Custo Unitario, Comissao, Prep, Frete, Impostos"
                    if f'-K{first_product_row}' in cell_form.value:
                        explicacao += f"\n         Esta margem inclui desconto de ADS"
                    else:
                        explicacao += f"\n         Esta margem NAO inclui ADS"
            elif '*$C$' in cell_form.value:
                # Multiplicação por célula fixa em C
                ref = cell_form.value.split('*$C$')[1].split(')')[0].strip()
                try:
                    ref_row = int(ref)
                    ref_value = ws_val.cell(ref_row, 3).value
                    ref_label = ws_val.cell(ref_row, 2).value
                    explicacao = f"CALCULO PERCENTUAL: Preco de Venda * {ref_label} ({ref_value})"
                except:
                    explicacao = "CALCULO PERCENTUAL baseado em premissa fixa"
            elif '=$C$' in cell_form.value:
                ref = cell_form.value.split('=$C$')[1].strip()
                try:
                    ref_row = int(ref)
                    ref_value = ws_val.cell(ref_row, 3).value
                    ref_label = ws_val.cell(ref_row, 2).value
                    explicacao = f"VALOR FIXO: {ref_label} ({ref_value})"
                except:
                    explicacao = "VALOR FIXO baseado em premissa"
            
            if explicacao:
                print(f"      Explicacao: {explicacao}")
    
    # Listar todos os produtos
    print("\n\n[PRODUTOS CADASTRADOS]")
    print("-" * 100)
    print("Lista de todos os produtos com seus valores calculados:\n")
    
    produtos_list = []
    for row in range(first_product_row, ws_val.max_row + 1):
        produto_nome = ws_val.cell(row, 2).value  # Coluna B - Produto
        if produto_nome and str(produto_nome).strip():
            produto_data = {
                'linha': row,
                'produto': str(produto_nome)
            }
            
            for col_info in headers_info:
                col = col_info['indice']
                value = ws_val.cell(row, col).value
                if value is not None:
                    produto_data[col_info['nome']] = value
            
            produtos_list.append(produto_data)
            
            # Mostrar resumo do produto
            print(f"\n{len(produtos_list)}. {produto_data.get('Produto', 'N/A')}")
            print(f"   Fornecedor: {produto_data.get('Fornecedor', 'N/A')}")
            print(f"   Custo: R$ {produto_data.get('Custo Unitário', 0)}")
            print(f"   Preço Venda: R$ {produto_data.get('Preço de venda', 0)}")
            
            margem = produto_data.get('Margem de Lucro', 0)
            margem_ads = produto_data.get('Margem pós ads', 0)
            
            if isinstance(margem, (int, float)):
                print(f"   Margem sem ADS: {margem*100:.1f}%")
            if isinstance(margem_ads, (int, float)):
                print(f"   Margem com ADS: {margem_ads*100:.1f}%")
                
                # Indicar se é lucrativo
                if margem_ads > 0:
                    print(f"   STATUS: LUCRATIVO ✓")
                else:
                    print(f"   STATUS: NAO LUCRATIVO ✗")

print("\n\n" + "=" * 100)
print("RESUMO DA LOGICA DE NEGOCIO")
print("=" * 100)

print("""
ESTRUTURA DA PLANILHA:

1. ABA MINERACAO (Principal):
   - Contem os produtos a serem vendidos na Amazon
   - Calcula automaticamente a lucratividade de cada produto
   - Usa premissas fixas (TACOS, Comissao, Aliquota, Frete, etc)
   
2. PREMISSAS CONFIGURADAS:
""")
for label, value in premissas.items():
    if isinstance(value, float) and value < 1:
        print(f"   - {label}: {value*100}%")
    else:
        print(f"   - {label}: R$ {value}")

print("""
3. CALCULO DE LUCRO POR PRODUTO:
   
   Margem sem ADS = (Preço Venda - Custo - Comissao - Prep - Frete - Impostos) / Preço Venda
   
   Margem com ADS = (Preço Venda - Custo - Comissao - Prep - Frete - Impostos - ADS) / Preço Venda
   
   Onde:
   - Comissao = Preço Venda * Taxa de Comissao (5%)
   - Prep = Valor fixo por unidade (R$ 1.30)
   - Frete = Valor fixo FBA (R$ 6.00)
   - Impostos = Preço Venda * Aliquota (4%)
   - ADS = Preço Venda * TACOS (5%)

4. OUTRAS ABAS:
   - DRE: Demonstrativo de Resultados do Exercicio (projecao financeira mensal)
   - Fluxo de Caixa: Controle de entradas e saidas
   - Lista de Fornecedores: Contatos dos fornecedores

5. OBJETIVO DO SISTEMA:
   Mapear produtos que dao LUCRO considerando TODOS os custos da Amazon:
   - Comissao da plataforma
   - Frete FBA (Fulfillment by Amazon)
   - Custo de preparacao (prep center)
   - Impostos
   - Investimento em anuncios (ADS)
""")

# Salvar análise completa
analise_completa = {
    'premissas': premissas,
    'estrutura_tabela': headers_info,
    'produtos': produtos_list,
    'total_produtos': len(produtos_list)
}

with open('analise_negocio.json', 'w', encoding='utf-8') as f:
    json.dump(analise_completa, f, ensure_ascii=False, indent=2)

print("\n\n" + "=" * 100)
print("[OK] Analise completa salva em: analise_negocio.json")
print(f"[INFO] Total de produtos analisados: {len(produtos_list)}")
print("=" * 100)
