from typing import Dict


class CalculadoraLucro:
    """Calcula lucratividade de produtos Amazon FBA"""
    
    def calcular(self, custo_unitario: float, preco_venda: float, 
                 config: Dict) -> Dict:
        """
        Calcula todos os valores de um produto
        
        Args:
            custo_unitario: Custo de compra do produto
            preco_venda: Preço de venda na Amazon
            config: Dicionário com premissas (tacos, taxa_comissao, etc)
        
        Returns:
            Dict com todos os valores calculados
        """
        # Validações
        if custo_unitario <= 0:
            raise ValueError("Custo unitário deve ser maior que zero")
        if preco_venda <= custo_unitario:
            raise ValueError("Preço de venda deve ser maior que custo unitário")
        
        # Extrair configurações
        tacos = config.get('tacos', 0.05)
        taxa_comissao = config.get('taxa_comissao', 0.05)
        custo_prep = config.get('custo_prep', 1.30)
        frete_fba = config.get('frete_fba', 6.00)
        aliquota_imposto = config.get('aliquota_imposto', 0.04)
        
        # FÓRMULA 1: Comissão
        comissao = preco_venda * taxa_comissao
        
        # FÓRMULA 2: Prep (fixo)
        prep = custo_prep
        
        # FÓRMULA 3: Frete (fixo)
        frete = frete_fba
        
        # FÓRMULA 4: Impostos
        impostos = preco_venda * aliquota_imposto
        
        # FÓRMULA 6: ADS
        ads = preco_venda * tacos
        
        # Custos totais
        custo_total_sem_ads = custo_unitario + comissao + prep + frete + impostos
        custo_total = custo_total_sem_ads + ads
        
        # FÓRMULA 5: Margem SEM ADS
        lucro_sem_ads = preco_venda - custo_total_sem_ads
        margem_sem_ads = lucro_sem_ads / preco_venda if preco_venda > 0 else 0
        margem_sem_ads = max(0, margem_sem_ads)
        
        # FÓRMULA 7: Margem COM ADS (REAL)
        lucro = preco_venda - custo_total
        margem = lucro / preco_venda if preco_venda > 0 else 0
        margem = max(0, margem)
        
        # Classificação baseada na margem com ADS
        if margem >= 0.25:
            classificacao = "EXCELENTE"
        elif margem >= 0.15:
            classificacao = "BOM"
        elif margem >= 0.05:
            classificacao = "MARGINAL"
        else:
            classificacao = "PREJUÍZO"
        
        # Percentuais de cada custo sobre o preço
        percentuais = {
            "custo_unitario": (custo_unitario / preco_venda) * 100,
            "comissao": (comissao / preco_venda) * 100,
            "prep": (prep / preco_venda) * 100,
            "frete": (frete / preco_venda) * 100,
            "impostos": (impostos / preco_venda) * 100,
            "ads": (ads / preco_venda) * 100,
            "lucro": (lucro / preco_venda) * 100
        }
        
        return {
            # Custos individuais
            "comissao": round(comissao, 2),
            "prep": round(prep, 2),
            "frete": round(frete, 2),
            "impostos": round(impostos, 2),
            "ads": round(ads, 2),
            
            # Custos totais
            "custo_total_sem_ads": round(custo_total_sem_ads, 2),
            "custo_total": round(custo_total, 2),
            
            # Margens
            "margem_sem_ads": round(margem_sem_ads, 4),
            "margem_com_ads": round(margem, 4),
            
            # Lucros
            "lucro_sem_ads": round(lucro_sem_ads, 2),
            "lucro_com_ads": round(lucro, 2),
            
            # Viabilidade
            "lucrativo": lucro > 0,
            "classificacao": classificacao,
            
            # Percentuais
            "percentuais": {k: round(v, 2) for k, v in percentuais.items()}
        }
    
    def simular_cenarios(self, produto: Dict, config: Dict) -> Dict:
        """
        Simula diferentes cenários para um produto
        
        Args:
            produto: Dicionário com dados do produto (custo_unitario, preco_venda)
            config: Configurações atuais
        
        Returns:
            Dict com simulações de diferentes cenários
        """
        custo = produto['custo_unitario']
        preco = produto['preco_venda']
        
        # Cenário 1: Aumentar preço em 10%
        novo_preco_up = preco * 1.10
        cenario_preco_up = self.calcular(custo, novo_preco_up, config)
        
        # Cenário 2: Reduzir preço em 10%
        novo_preco_down = preco * 0.90
        cenario_preco_down = self.calcular(custo, novo_preco_down, config)
        
        # Cenário 3: Reduzir custo em 10%
        novo_custo_down = custo * 0.90
        cenario_custo_down = self.calcular(novo_custo_down, preco, config)
        
        # Cenário 4: Reduzir TACOS para 3%
        config_low_tacos = config.copy()
        config_low_tacos['tacos'] = 0.03
        cenario_low_tacos = self.calcular(custo, preco, config_low_tacos)
        
        return {
            "preco_mais_10": {
                "novo_preco": round(novo_preco_up, 2),
                "margem": cenario_preco_up['margem_com_ads'],
                "lucro": cenario_preco_up['lucro_com_ads'],
                "diferenca_lucro": round(cenario_preco_up['lucro_com_ads'] - produto['calculado']['lucro_com_ads'], 2)
            },
            "preco_menos_10": {
                "novo_preco": round(novo_preco_down, 2),
                "margem": cenario_preco_down['margem_com_ads'],
                "lucro": cenario_preco_down['lucro_com_ads'],
                "diferenca_lucro": round(cenario_preco_down['lucro_com_ads'] - produto['calculado']['lucro_com_ads'], 2)
            },
            "custo_menos_10": {
                "novo_custo": round(novo_custo_down, 2),
                "margem": cenario_custo_down['margem_com_ads'],
                "lucro": cenario_custo_down['lucro_com_ads'],
                "diferenca_lucro": round(cenario_custo_down['lucro_com_ads'] - produto['calculado']['lucro_com_ads'], 2)
            },
            "tacos_3_porcento": {
                "novo_tacos": "3%",
                "margem": cenario_low_tacos['margem_com_ads'],
                "lucro": cenario_low_tacos['lucro_com_ads'],
                "diferenca_lucro": round(cenario_low_tacos['lucro_com_ads'] - produto['calculado']['lucro_com_ads'], 2)
            }
        }
