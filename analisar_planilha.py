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
print(f"[ARQUIVO] {planilha}\n")

# Carregar a planilha
wb = openpyxl.load_workbook(planilha, data_only=False)

print("=" * 80)
print("ANALISE COMPLETA DA PLANILHA - MAPEADOR DE PRECOS")
print("=" * 80)

# Listar todas as abas
print(f"\n[ABAS] Total de abas: {len(wb.sheetnames)}")
print("-" * 80)
for idx, sheet_name in enumerate(wb.sheetnames, 1):
    print(f"{idx}. {sheet_name}")

# Analisar cada aba
for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    print(f"\n\n{'=' * 80}")
    print(f"ABA: {sheet_name}")
    print(f"{'=' * 80}")
    
    # Dimensões da aba
    print(f"\n[DIMENSOES]")
    print(f"   Linhas com dados: {ws.max_row}")
    print(f"   Colunas com dados: {ws.max_column}")
    
    # Cabeçalhos (primeira linha)
    print(f"\n[CABECALHOS] Linha 1:")
    headers = []
    for col in range(1, ws.max_column + 1):
        cell = ws.cell(1, col)
        if cell.value:
            col_letter = get_column_letter(col)
            headers.append(f"{col_letter}: {cell.value}")
            print(f"   {col_letter}: {cell.value}")
    
    # Amostra de dados (primeiras 5 linhas)
    print(f"\n[AMOSTRA DE DADOS] Primeiras 5 linhas:")
    for row in range(1, min(6, ws.max_row + 1)):
        row_data = []
        for col in range(1, ws.max_column + 1):
            cell = ws.cell(row, col)
            val = str(cell.value) if cell.value else ""
            if len(val) > 30:
                val = val[:27] + "..."
            row_data.append(val)
        print(f"   Linha {row}: {' | '.join(row_data[:8])}")
    
    # Detectar fórmulas
    print(f"\n[FORMULAS ENCONTRADAS]")
    formulas_found = []
    for row in ws.iter_rows():
        for cell in row:
            if cell.value and isinstance(cell.value, str) and cell.value.startswith('='):
                formulas_found.append({
                    'cell': cell.coordinate,
                    'formula': cell.value,
                    'row': cell.row,
                    'col': get_column_letter(cell.column)
                })
    
    if formulas_found:
        # Agrupar por tipo de fórmula
        formula_types = {}
        for f in formulas_found:
            # Extrair o tipo de fórmula (primeira função encontrada)
            formula = f['formula'].upper()
            if 'SUM' in formula or 'SOMA' in formula:
                key = 'SUM/SOMA (Soma)'
            elif 'IF' in formula or 'SE' in formula:
                key = 'IF/SE (Condicional)'
            elif 'VLOOKUP' in formula or 'PROCV' in formula:
                key = 'VLOOKUP/PROCV (Busca Vertical)'
            elif 'HLOOKUP' in formula or 'PROCH' in formula:
                key = 'HLOOKUP/PROCH (Busca Horizontal)'
            elif 'AVERAGE' in formula or 'MÉDIA' in formula or 'MEDIA' in formula:
                key = 'AVERAGE/MEDIA'
            elif 'MAX' in formula or 'MIN' in formula:
                key = 'MAX/MIN'
            elif 'COUNT' in formula or 'CONT' in formula:
                key = 'COUNT/CONT (Contagem)'
            elif '*' in formula or '/' in formula:
                key = 'ARITMETICA (Calculos basicos)'
            else:
                key = 'OUTRAS'
            
            if key not in formula_types:
                formula_types[key] = []
            formula_types[key].append(f)
        
        print(f"   Total de formulas: {len(formulas_found)}")
        print(f"\n   Por tipo:")
        for ftype, formulas in formula_types.items():
            print(f"   - {ftype}: {len(formulas)} formulas")
        
        print(f"\n   Exemplos de formulas (primeiras 15):")
        for i, f in enumerate(formulas_found[:15], 1):
            print(f"   {i}. {f['cell']} ({f['col']}{f['row']}): {f['formula']}")
    else:
        print("   Nenhuma formula encontrada nesta aba.")
    
    # Dados com valores (não vazios)
    print(f"\n[ESTATISTICAS DE DADOS]")
    non_empty_cells = sum(1 for row in ws.iter_rows() for cell in row if cell.value)
    total_cells = ws.max_row * ws.max_column
    print(f"   Celulas com dados: {non_empty_cells}")
    print(f"   Total de celulas: {total_cells}")
    print(f"   Ocupacao: {(non_empty_cells/total_cells*100):.1f}%")
    
    # Detectar possíveis cálculos de lucro/margem
    print(f"\n[COLUNAS RELACIONADAS A PRECO/LUCRO]")
    price_keywords = ['preço', 'preco', 'valor', 'custo', 'lucro', 'margem', 'venda', 'compra', '%', 'taxa', 'imposto', 'frete', 'desconto']
    price_cols = []
    for col in range(1, ws.max_column + 1):
        header = ws.cell(1, col).value
        if header and any(keyword in str(header).lower() for keyword in price_keywords):
            col_letter = get_column_letter(col)
            price_cols.append((col_letter, header))
            print(f"   {col_letter}: {header}")
            # Mostrar alguns valores desta coluna
            sample_values = []
            for row in range(2, min(7, ws.max_row + 1)):
                val = ws.cell(row, col).value
                if val:
                    sample_values.append(str(val)[:20])
            if sample_values:
                print(f"      Exemplos: {', '.join(sample_values)}")
    
    if not price_cols:
        print("   Nenhuma coluna relacionada a preco/lucro encontrada.")

print("\n\n" + "=" * 80)
print("ANALISE CONCLUIDA!")
print("=" * 80)

# Salvar estrutura detalhada em JSON
output = {
    'arquivo': planilha,
    'abas': [],
    'total_formulas': 0
}

for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    
    # Cabeçalhos
    headers = []
    for col in range(1, ws.max_column + 1):
        cell = ws.cell(1, col)
        if cell.value:
            headers.append({
                'coluna': get_column_letter(col),
                'nome': str(cell.value)
            })
    
    # Fórmulas
    formulas = []
    for row in ws.iter_rows():
        for cell in row:
            if cell.value and isinstance(cell.value, str) and cell.value.startswith('='):
                formulas.append({
                    'celula': cell.coordinate,
                    'linha': cell.row,
                    'coluna': get_column_letter(cell.column),
                    'formula': cell.value
                })
    
    # Dados de exemplo (primeiras 10 linhas)
    dados_exemplo = []
    for row in range(1, min(11, ws.max_row + 1)):
        linha_dados = {}
        for col in range(1, ws.max_column + 1):
            cell = ws.cell(row, col)
            col_letter = get_column_letter(col)
            if cell.value:
                linha_dados[col_letter] = str(cell.value)
        if linha_dados:
            dados_exemplo.append(linha_dados)
    
    output['abas'].append({
        'nome': sheet_name,
        'linhas': ws.max_row,
        'colunas': ws.max_column,
        'cabecalhos': headers,
        'formulas': formulas,
        'dados_exemplo': dados_exemplo
    })
    output['total_formulas'] += len(formulas)

with open('estrutura_planilha.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("\n[OK] Estrutura detalhada salva em: estrutura_planilha.json")
print(f"\n[RESUMO]")
print(f"   Total de abas: {len(output['abas'])}")
print(f"   Total de formulas: {output['total_formulas']}")
for aba in output['abas']:
    print(f"   - {aba['nome']}: {aba['linhas']} linhas x {aba['colunas']} colunas, {len(aba['formulas'])} formulas")
